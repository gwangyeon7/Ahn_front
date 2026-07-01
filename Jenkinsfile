// Zero Check SBOM - 풀스택 CI/CD 파이프라인
//
// 흐름: GitHub Webhook → Validate Inputs → Build(FE+BE) → Deploy(EC2)
//      → RDS 연결 확인 → Health Check → (실패 시 Rollback) → Slack 알림
//
// 사전 준비물 (docs/JENKINS_PIPELINE.md 참고):
//   - Jenkins Credentials: ec2-ssh-key, frontend-ec2-host, backend-ec2-host,
//                           rds-endpoint, rds-db-credentials, slack-webhook-url
//   - GitHub repo > Settings > Webhooks 에 Jenkins payload URL 등록
//   - Jenkins Slack plugin 설치 + 워크스페이스 연동

pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '20'))
        ansiColor('xterm')
    }

    triggers {
        // GitHub Webhook 자동 빌드 (GitHub plugin 설치 + repo에 webhook 등록 필요)
        githubPush()
    }

    parameters {
        choice(name: 'DEPLOY_ENV', choices: ['dev', 'staging', 'prod'], description: '배포 환경')
        string(name: 'BACKEND_GIT_URL', defaultValue: '', description: '백엔드 저장소 Git URL (예: git@github.com:org/repo.git). 비워두면 백엔드 빌드/배포 스킵')
        string(name: 'BACKEND_GIT_BRANCH', defaultValue: 'main', description: '백엔드 브랜치')
        string(name: 'REMOTE_USER', defaultValue: 'ubuntu', description: 'EC2 SSH 접속 계정')
    }

    environment {
        BUILD_TAG_NUM   = "${env.BUILD_NUMBER}"
        FRONTEND_RELEASE_DIR = "releases/${BUILD_TAG_NUM}"
        BACKEND_WAR_NAME     = "app-${BUILD_TAG_NUM}.war"
        SKIP_BACKEND         = "${params.BACKEND_GIT_URL == '' ? 'true' : 'false'}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // ✅ Validate Inputs: 필수 파라미터 / Credentials 존재 여부를 가장 먼저 검증
        // 잘못된 입력으로 빌드를 다 돌리고 마지막에 실패하는 것을 방지
        stage('Validate Inputs') {
            steps {
                script {
                    if (!(params.DEPLOY_ENV in ['dev', 'staging', 'prod'])) {
                        error("❌ 잘못된 DEPLOY_ENV 값: ${params.DEPLOY_ENV}")
                    }
                    echo "✅ DEPLOY_ENV = ${params.DEPLOY_ENV}"

                    sh '''
                        echo "🔍 필수 CLI 도구 점검"
                        command -v node >/dev/null 2>&1 || { echo "❌ node 가 설치되어 있지 않습니다."; exit 1; }
                        command -v npm  >/dev/null 2>&1 || { echo "❌ npm 이 설치되어 있지 않습니다.";  exit 1; }
                        command -v ssh  >/dev/null 2>&1 || { echo "❌ ssh 클라이언트가 없습니다.";      exit 1; }
                        node -v
                        npm -v
                    '''

                    // Credentials 가 Jenkins에 등록돼 있는지 미리 확인 (값은 출력하지 않음)
                    withCredentials([
                        sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'SSH_KEY_CHECK'),
                        string(credentialsId: 'frontend-ec2-host', variable: 'FE_HOST_CHECK'),
                        string(credentialsId: 'slack-webhook-url', variable: 'SLACK_URL_CHECK')
                    ]) {
                        echo "✅ 필수 Credentials 확인 완료 (frontend-ec2-host, ec2-ssh-key, slack-webhook-url)"
                    }

                    if (env.SKIP_BACKEND == 'false') {
                        withCredentials([
                            string(credentialsId: 'backend-ec2-host', variable: 'BE_HOST_CHECK'),
                            string(credentialsId: 'rds-endpoint', variable: 'RDS_HOST_CHECK')
                        ]) {
                            echo "✅ 백엔드 관련 Credentials 확인 완료 (backend-ec2-host, rds-endpoint)"
                        }
                    } else {
                        echo "ℹ️ BACKEND_GIT_URL 미입력 → 백엔드 빌드/배포/RDS 점검 단계는 스킵됩니다."
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                sh '''
                    echo "📦 프론트엔드 빌드 시작"
                    npm ci
                    npm run build
                '''
            }
        }

        stage('Checkout & Build Backend') {
            when { expression { env.SKIP_BACKEND == 'false' } }
            steps {
                dir('backend') {
                    git branch: params.BACKEND_GIT_BRANCH, url: params.BACKEND_GIT_URL
                    sh '''
                        echo "📦 백엔드 빌드 시작"
                        if [ -f mvnw ]; then
                            ./mvnw -B clean package -DskipTests
                        elif [ -f pom.xml ]; then
                            mvn -B clean package -DskipTests
                        elif [ -f gradlew ]; then
                            ./gradlew clean build -x test
                        else
                            echo "❌ pom.xml / gradlew 를 찾을 수 없습니다."
                            exit 1
                        fi
                    '''
                }
            }
        }

        stage('Deploy Frontend to EC2') {
            steps {
                withCredentials([
                    sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER_FROM_CRED'),
                    string(credentialsId: 'frontend-ec2-host', variable: 'FE_HOST')
                ]) {
                    sh '''
                        chmod +x scripts/deploy-frontend.sh
                        ./scripts/deploy-frontend.sh "$FE_HOST" "$SSH_KEY" "$BUILD_TAG_NUM" "$REMOTE_USER" "dist"
                    '''
                }
            }
        }

        stage('Deploy Backend to EC2') {
            when { expression { env.SKIP_BACKEND == 'false' } }
            steps {
                withCredentials([
                    sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'SSH_KEY'),
                    string(credentialsId: 'backend-ec2-host', variable: 'BE_HOST')
                ]) {
                    sh '''
                        chmod +x scripts/deploy-backend.sh
                        WAR_FILE=$(find backend -name "*.war" | head -n 1)
                        if [ -z "$WAR_FILE" ]; then
                            echo "❌ 빌드된 war 파일을 찾을 수 없습니다."
                            exit 1
                        fi
                        ./scripts/deploy-backend.sh "$BE_HOST" "$SSH_KEY" "$BUILD_TAG_NUM" "$REMOTE_USER" "$WAR_FILE"
                    '''
                }
            }
        }

        // ✅ RDS 연동 확인: 아직 마이그레이션 도구가 없으므로 "백엔드 EC2 -> RDS" 네트워크/포트
        // 연결이 살아있는지만 확인한다. (DB 계정이 있으면 SELECT 1 까지 시도)
        stage('Verify RDS Connectivity') {
            when { expression { env.SKIP_BACKEND == 'false' } }
            steps {
                withCredentials([
                    sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'SSH_KEY'),
                    string(credentialsId: 'backend-ec2-host', variable: 'BE_HOST'),
                    string(credentialsId: 'rds-endpoint', variable: 'RDS_HOST'),
                    usernamePassword(credentialsId: 'rds-db-credentials', usernameVariable: 'RDS_USER', passwordVariable: 'RDS_PASSWORD')
                ]) {
                    sh '''
                        chmod +x scripts/check-rds-connection.sh
                        ./scripts/check-rds-connection.sh "$BE_HOST" "$SSH_KEY" "$REMOTE_USER" "$RDS_HOST" "3306" "$RDS_USER" "$RDS_PASSWORD"
                    '''
                }
            }
        }

        // ✅ Health Check 실패 시 빌드 자체를 실패로 처리 (script 가 non-zero exit -> 파이프라인 실패 -> post.failure 에서 Rollback)
        stage('Health Check') {
            steps {
                withCredentials([
                    string(credentialsId: 'frontend-ec2-host', variable: 'FE_HOST')
                ]) {
                    sh '''
                        chmod +x scripts/health-check.sh
                        ./scripts/health-check.sh "http://$FE_HOST/" 10 5
                    '''
                }

                script {
                    if (env.SKIP_BACKEND == 'false') {
                        withCredentials([string(credentialsId: 'backend-ec2-host', variable: 'BE_HOST')]) {
                            sh '''
                                ./scripts/health-check.sh "http://$BE_HOST:8080/api/health" 10 5
                            '''
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            withCredentials([string(credentialsId: 'slack-webhook-url', variable: 'SLACK_URL')]) {
                sh '''
                    curl -s -X POST -H 'Content-type: application/json' \
                        --data "{\\"text\\":\\"✅ [${JOB_NAME}] #${BUILD_NUMBER} 배포 성공 (env: ${DEPLOY_ENV})\\"}" \
                        "$SLACK_URL"
                '''
            }
        }

        failure {
            script {
                echo "🔥 파이프라인 실패 → Rollback 시도"
                def prevBuild = currentBuild.previousSuccessfulBuild?.number

                if (prevBuild) {
                    withCredentials([
                        sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'SSH_KEY'),
                        string(credentialsId: 'frontend-ec2-host', variable: 'FE_HOST')
                    ]) {
                        sh '''
                            chmod +x scripts/rollback.sh
                            ./scripts/rollback.sh frontend "$FE_HOST" "$SSH_KEY" "$REMOTE_USER" "''' + prevBuild + '''"
                        '''
                    }

                    if (env.SKIP_BACKEND == 'false') {
                        withCredentials([
                            sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'SSH_KEY'),
                            string(credentialsId: 'backend-ec2-host', variable: 'BE_HOST')
                        ]) {
                            sh '''
                                ./scripts/rollback.sh backend "$BE_HOST" "$SSH_KEY" "$REMOTE_USER" "''' + prevBuild + '''"
                            '''
                        }
                    }
                } else {
                    echo "⚠️ 이전 성공 빌드가 없어 Rollback을 건너뜁니다. (최초 배포 추정)"
                }

                withCredentials([string(credentialsId: 'slack-webhook-url', variable: 'SLACK_URL')]) {
                    sh '''
                        curl -s -X POST -H 'Content-type: application/json' \
                            --data "{\\"text\\":\\"❌ [${JOB_NAME}] #${BUILD_NUMBER} 배포 실패 → Rollback 수행 (env: ${DEPLOY_ENV})\\"}" \
                            "$SLACK_URL"
                    '''
                }
            }
        }

        always {
            cleanWs()
        }
    }
}

import json
from datetime import datetime
import os
# 검사 이력 정보 json 파일 생성

def create_scan_report(user_name):
    # 1. 정보 설정 (딕셔너리로 작성)
    report_data = {
        "report_info": {
            "project_name": "SBOM-security-project",
            "inspector": user_name,  # 검사하는 사람 이름
            "scan_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"), # 실시간 시간+날짜
            "environment": "Windows / Git Bash"
        },
        "files_generated": [
            "libraries.json",
            "vulnerabilities.json"
        ]
    }

    # 2. 'inspection_info' 폴더가 없으면 생성
    if not os.path.exists('inspection_info'):
        os.makedirs('inspection_info')

    # 3. JSON 파일로 저장 (덮어쓰기)
    file_path = "inspection_info/scan_info.json"
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(report_data, f, indent=4, ensure_ascii=False)

    print(f"✅ 검사 정보 파일이 생성완료!: {file_path}")

# 실행
if __name__ == "__main__":
    create_scan_report("JeonYouwe") # 검사하는 사람 이름으로 설정
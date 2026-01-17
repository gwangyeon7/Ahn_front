import json
import os
import requests

def process_security_data():
    base_path = "." # syft와 grype로 생성한 파일이 있는 경로
    scan_info_path = "inspection_info"  # scan_info.json 파일이 있는 경로
    
    # 1. 파일 읽기 (안전하게 예외처리를 사용해서 경로 설정)
    try:
        with open(f"{scan_info_path}/scan_info.json", "r", encoding="utf-8") as f:
            scan_info = json.load(f)
        with open(f"{base_path}/libraries.json", "r", encoding="utf-8") as f:
            libraries = json.load(f)
        with open(f"{base_path}/vulnerabilities.json", "r", encoding="utf-8") as f:
            vulnerabilities = json.load(f)
    except FileNotFoundError as e:
        print(f"해당 파일을 찾을 수 없습니다: {e}")
        return

    # 2. 데이터 가공 (백엔드용 요약본 생성)
    # 취약점 등급별로 개수를 파악
    matches = vulnerabilities.get("matches", [])
    severity_counts = {"critical": 0, "high": 0, "medium": 0, "low": 0}
    
    for item in matches:
        sev = item.get("vulnerability", {}).get("severity", "").lower()
        if sev in severity_counts:
            severity_counts[sev] += 1

    # 3. 최종적으로 통합한 객체 구성 (딕셔너리)
    processed_report = {
        "metadata": scan_info["report_info"],
        "summary": {
            "total_libraries": len(libraries.get("artifacts", [])),
            "total_vulnerabilities": len(matches),
            "severity_summary": severity_counts
        },
        # 상세 데이터 (필요한 경우에만 포함)
        "scan_results": {
            "vulnerabilities": matches[:5]  # 예시로 상위 5개만 포함
        }
    }

    # 4. 가공된 파일 저장
    output_path = f"{base_path}/final_report.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(processed_report, f, indent=4, ensure_ascii=False)

    print(f"🚀 백엔드 전송용 데이터 가공 완료: {output_path}")
    return processed_report

    
# 백엔드로 전송
def send_to_backend(report_data):
    # 백엔드 API 주소
    back_url = ""
    
    try:
        # response = requests.post(back_url, json=report_data)
        # print(f'전송 상태 코드: {response.status_code}')
        print('백엔드 전송 함수가 호출됨')
    except Exception as e:
        print(f"❌ 백엔드 전송 중 오류 발생: {e}")
        

# 실행
if __name__ == "__main__":
    report_data = process_security_data()
    if report_data:
        send_to_backend(report_data)
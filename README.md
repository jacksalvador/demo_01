# 첫번째 데모 준비

# Getting Started

## 로컬 환경 구성

로컬 Python 환경 구성

### Python

- Python 3.X 설치
- pipenv 설치 : pip install pipenv

### IDE

- [VS Code](https://code.visualstudio.com)
  > VS Code Extensions
  >
  > - Python
  > - .vscode/settings.json
  >   > - "editor.formatOnSave": true,
  >   > - "python.formatting.provider": "black"

### CI - 소스관리

- GitLab 계정 발급
- GitLab에서 소스코드 clone: git clone hhttps://gitlab.dev.mopapp.net/opt/mop-opt.git

### 패키지 설치

- pipenv install --dev
- pipenv shell

### Lint

- flake8(Code Format Checker) : pipenv run flake
- black(Source Code Formatting Tool) : pipenv run lint

### Run

- ex) pipenv run python src/app.py

### Test

- unit test : pipenv run unit
- module test : pipenv run module

### Docker Build

- docker build . --tag mop-opt:latest
- docker run --name mop-opt -d -p 7072:7072 mop-opt:latest
- docker start mop-opt
- docker container rm mop-opt (container 삭제)
- docker restart (이미지 재빌드 후)

### Local에서 DEV DB, S3접근 설정

- export environment=default-dev (환경을 default-dev로 설정)
- config.yml에서 {password}, {aws-access-key-id}, {aws-secret-access-key} 변경
- {local_key_file_path}를 pem파일의 절대경로 위치로 변경
- pipenv run python src/app.py
- http://localhost:7072/members  (DB접근 샘플)
- http://localhost:7072/s3/raw/media-stat-data/naver/sa/20220517/2232364/20220509  (S3 샘플)

### Local에서 docker container로 DEV DB, S3접근 설정

- config.yml에서 {password}, {aws-access-key-id}, {aws-secret-access-key} 변경
- config.yml에서 private-key-file: /srv/mop-bastion-keypair.pem 확인
- docker build / start
- http://localhost:7072/members  (DB접근 샘플)
- http://localhost:7072/s3/raw/media-stat-data/naver/sa/20220517/2232364/20220509  (S3 샘플)


### 신규 고객이 등록되었을 때 추론 전 할일
- 최신 모델을 S3에 업로드 (pct 모델이면 pct_info도 업로드)
- abnormal 데이터를 DB적재




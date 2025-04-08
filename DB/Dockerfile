FROM mysql:latest


# 스키마 파일 복사
COPY kidsnomy.sql /docker-entrypoint-initdb.d/
COPY kidsnomy_all_dummy_data.sql /docker-entrypoint-initdb.d/

# kidsmony.sql 파일이 컨테이너 내부에 복사된 정확한 경로를 사용하세요.
# CMD [ "tail", "-f", "/dev/null" ]

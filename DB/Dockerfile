FROM mysql:8.0.40

# 스키마 파일 복사
COPY kidsnomy.sql /docker-entrypoint-initdb.d/

# CMD [ "mysql", "-u", "ssafy", "-p", "ssafy",  "<", "kidsmony.sql" ]
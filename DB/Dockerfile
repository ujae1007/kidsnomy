FROM mysql:latest

# 스키마 파일 복사
COPY kidsnomy.sql /docker-entrypoint-initdb.d/

# CMD [ "mysql", "-u", "root", "-p", "kidsnomy",  "<", "kidsmony.sql" ]
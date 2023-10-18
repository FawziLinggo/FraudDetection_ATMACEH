FROM python:3
WORKDIR /app
COPY . .
RUN apt-get -y update && apt-get -y --force-yes install netcat telnet net-tools iputils-ping
RUN apt-get -y --force-yes install python3-pip
RUN chmod +x start.sh
RUN pip3 install --no-cache-dir -r scripts/requirements.txt

#RUN pip install 
CMD ["/bin/sh", "start.sh"]
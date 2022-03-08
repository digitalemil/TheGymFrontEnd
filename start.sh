node /opt/app/bin/www &
sleep 10
/bin/agent --config.file=/opt/app/agent-config.yaml &
tail -f /dev/null

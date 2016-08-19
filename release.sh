#!/usr/bin/env bash
[ -a extension.zip ] && rm extension.zip && echo 'delete extension.zip'
echo 'creating extension.zip'
zip -9 -r --exclude=*.git* --exclude=*.idea* --exclude=*docs* --exclude=release.sh extension.zip .

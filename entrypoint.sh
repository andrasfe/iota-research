#!/bin/bash
for i in {1..100000}
do
    yarn stats0
    echo "Ran $i times"
done

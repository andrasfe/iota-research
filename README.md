A Practical Implementation of the Depth-First Search Algorithm in Tip Selection for the IOTA Distributed Ledger

to run the snapshot: 

```sh
git clone https://andrasferenczi7@bitbucket.org/andrasferenczi7/dfs_iota_research.git
cd dfs_iota_research
npm install
```

To save a tangle snashot, run: 
```sh
npm run tangle
```

Running the unit/integration tests:

```sh
npm run test`
```

Test harness:

```sh
npm run stats3
```

To generate reports, you need to have `python 3.7x` installed along with `mathplotlib`, `scipy` and `numpy`
```sh
cd reports/
python report_iota_snapshot.py
```

For performance benchmarks:
```sh
// ALGO variable must be set. can have values: calculateRatingBfs, calculateRatingDfs

ALGO=calculateRatingBfs npm run stats0
```

For performance benchmarks build docker:

```sh
docker build -t my_image:v1 .
docker run my_image:v1
docker ps
docker exec -it <container id> /bin/bash
```

To clean up:

```sh
docker rm $(docker ps -a -q)
docker rmi $(docker images -q)
```











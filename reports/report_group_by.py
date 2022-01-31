import matplotlib.pyplot as plt
import pandas as pd
from scipy.interpolate import make_interp_spline, BSpline
import numpy as np

if __name__ == "__main__":
	df = pd.read_csv('../benchmarks.dfs.csv')

	ax = plt.gca()
	df.columns = ['V', 'E', 'Time', 'Perc']
	df = df[df['Time'] < 40] # 40 for DFS, 400 for BFS
	# df = df[df['Time'] > 0]
	df['E'] = df['E']//100
	df = df[['E', 'Time']]
	df = pd.DataFrame(df.groupby('E').mean()).reset_index()
	# df.plot(kind='line',x='V',y='Time',ax=ax)
	print(df.head(40))
	# xlabel="No. of Edges  x 100", ylabel="Time (ms)", 
	df.plot(kind='line',x='E',y='Time', color='blue', ax=ax)
	ax.set_xlabel("No. of Edges  x 100")
	ax.set_ylabel("Time (ms)")
	# ax.set_title("IRI Testing Results")
	ax.set_title("Our implementation Simulation Test Results")

	# plt.show()
	# df = df[df['E'] < 25000]
	df = df.sort_values(by=['E'])
	tNew = np.linspace(df['E'].min(), df['E'].max(), 7) 
	spl = make_interp_spline(df['E'].to_numpy(), df['Time'].to_numpy(), k=3)  # type: BSpline
	edgesSmooth = spl(tNew)
	plt.plot(tNew, edgesSmooth, "r-")
	plt.show()

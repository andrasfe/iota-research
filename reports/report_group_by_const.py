import matplotlib.pyplot as plt
import pandas as pd
from scipy.interpolate import make_interp_spline, BSpline
import numpy as np

if __name__ == "__main__":
	df = pd.read_csv('../benchmarks.const.dfs.csv')

	ax = plt.gca()
	df.columns = ['V', 'E', 'Time', 'Perc']
	# df = df[df['Time'] < 800] # 40 for DFS, 400 for BFS
	print(df.head(40))
	# xlabel="No. of Edges  x 1,000", ylabel="Time (ms)", 
	df['V'] = df['V']//100
	df = df[['V', 'Time']]
	df = pd.DataFrame(df.groupby('V').mean()).reset_index()

	df.plot(kind='line',x='V',y='Time', color='blue', ax=ax)
	ax.set_xlabel(" x 100 No. of Vertices for const. 20,000 Edges")
	ax.set_ylabel("Time (ms)")
	# ax.set_title("IRI Testing Results")
	ax.set_title("Our implementation Test Results")

	# plt.show()
	# df = df[df['E'] < 25000]
	df = df.sort_values(by=['V'])
	tNew = np.linspace(df['V'].min(), df['V'].max(), 7) 
	spl = make_interp_spline(df['V'].to_numpy(), df['Time'].to_numpy(), k=3)  # type: BSpline
	edgesSmooth = spl(tNew)
	plt.plot(tNew, edgesSmooth, "r-")
	plt.show()

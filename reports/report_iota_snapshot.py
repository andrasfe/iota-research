import matplotlib.pyplot as plt
import pandas as pd
from scipy.interpolate import make_interp_spline, BSpline
import numpy as np

def plot_results(title, csv_name):
	df = pd.read_csv('../' + csv_name + '.csv')
	ax = plt.gca()
	df.columns = ['V', 'E', 'Time']

	df = df[['V', 'Time']]
	df = pd.DataFrame(df.groupby('V').mean()).reset_index()
	print(df.head(5))
	df.plot(kind='line',x='V',y='Time', color='blue', ax=ax)
	ax.set_xlabel("No. of Transactions")
	ax.set_ylabel("Time (ms)")
	# ax.set_title("IRI Testing Results")
	ax.set_title(title + " implementation Test Results")

	
	df = df.sort_values(by=['V'])
	tNew = np.linspace(df['V'].min(), df['V'].max(), 7) 
	spl = make_interp_spline(df['V'].to_numpy(), df['Time'].to_numpy(), k=3)  # type: BSpline
	edgesSmooth = spl(tNew)
	plt.plot(tNew, edgesSmooth, "r-")
	plt.savefig(csv_name + '.jpg', dpi=150, bbox_inches='tight')
	# plt.show()


if __name__ == "__main__":
	# plot_results('IRI', 'benchmarks.real.iri')
	plot_results('Proposed', 'benchmarks.real.ours')

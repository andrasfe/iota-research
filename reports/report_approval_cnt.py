import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

if __name__ == "__main__":
    df = pd.read_json('../approval-cnt-distribution.json')
    df.columns = ['Approvals']
    ax = plt.gca()
    ax.set_xlabel("No. of approvals by message")
    ax.set_title("Tangle 1 hour snapshot")
    df.plot.hist(ax=ax)
    plt.savefig('../approval-cnt-distribution.jpg', dpi=150, bbox_inches='tight')
    plt.show()

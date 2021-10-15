import pandas as pd
import matplotlib.pyplot as plt
from scipy.stats import linregress

def draw_plot():
    # Read data from file
    df = pd.read_csv("epa-sea-level.csv")
    # print(df)

    # Create scatter plot
    fig, ax = plt.subplots(figsize=(10, 5))
    plt.scatter(df.Year, df["CSIRO Adjusted Sea Level"])
    ax.set(xlabel='Year', ylabel='Sea Level (inches)', title='Rise in Sea Level')
    
    # Create first line of best fit
    df_future = df.Year
    aux = pd.Series([i for i in range(df.Year.max() + 1, 2051)])
    df_future = df_future.append(aux)
    df_future.name = "Year"
    # print(df_future)

    res = linregress(df.Year, df["CSIRO Adjusted Sea Level"])
    plt.plot(df_future, res.intercept + res.slope*df_future, 'r', label='1889 - 2050')
    
    # Create second line of best fit
    df_parsed = df[df.Year >= 2000]

    df_pfuture = df_parsed.Year
    aux = pd.Series([i for i in range(df_parsed.Year.max() + 1, 2051)])
    df_pfuture = df_pfuture.append(aux)
    df_pfuture.name = "Year"
    # print(df_pfuture)

    res2 = linregress(df_parsed.Year, df_parsed["CSIRO Adjusted Sea Level"])
    plt.plot(df_pfuture, res2.intercept + res2.slope*df_pfuture, 'g', label='2000 - 2050')

    # Add labels and title
    plt.legend()
    # Save plot and return data for testing (DO NOT MODIFY)
    # plt.show()
    plt.savefig('sea_level_plot.png')
    return plt.gca()

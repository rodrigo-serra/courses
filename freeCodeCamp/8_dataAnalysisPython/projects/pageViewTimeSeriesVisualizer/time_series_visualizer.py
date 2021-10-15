import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import pandas as pd
import seaborn as sns
from pandas.plotting import register_matplotlib_converters
register_matplotlib_converters()

# Import data (Make sure to parse dates. Consider setting index column to 'date'.)
# Dates don't need any processing.
df = pd.read_csv("fcc-forum-pageviews.csv", index_col=0, parse_dates=["date"])

# Clean data
# The bottom 2.5% of the dataset
# indexes = df[(df['value'] <= df['value'].quantile(0.025))].index
# df.drop(indexes, inplace=True)
# # The top 2.5% of the dataset
# indexes = df[(df['value'] >= df['value'].quantile(0.975))].index
# df.drop(indexes, inplace=True)
df = df[
  (df["value"] >= df['value'].quantile(0.025)) &
  (df["value"] <= df['value'].quantile(0.975))
  ]

# This test should run because it works here
# print(int(df.count(numeric_only=True)))

def draw_line_plot():
    # Draw line plot
    fig, ax = plt.subplots()
    # fig, ax = plt.subplots(figsize=(15, 10))
    ax.plot(df.index, df["value"], 'r', linewidth=1)
    ax.set(xlabel='Date', ylabel='Page Views',
       title='Daily freeCodeCamp Forum Page Views 5/2016-12/2019')
    ax.grid()
    # plt.show()

    # NOTES: When dealing with dates, the plot does the tick formattiing automatically for you
    # Major ticks every 6 months.
    # fmt_half_year = mdates.MonthLocator(interval=6)
    # ax.xaxis.set_major_locator(fmt_half_year)
    # # Text in the x axis will be displayed in 'YYYY-mm' format.
    # ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m'))

    # Save image and return fig (don't change this part)
    fig.savefig('line_plot.png')
    return fig

def draw_bar_plot():
    # Copy and modify data for monthly bar plot
    df["month"] = df.index.month
    df["year"] = df.index.year

    df_bar = df.groupby(["year", "month"])["value"].mean()
    df_bar = df_bar.unstack()
    
    # Once again the data doesn't need any more processing. The plot will take care of the rest
    # Draw bar plot
    fig = df_bar.plot.bar(legend=True, xlabel="Years", ylabel="Average Page Views").figure
    plt.legend(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], title="Months")

    # Save image and return fig (don't change this part)
    fig.savefig('bar_plot.png')
    return fig

def draw_box_plot():
    # Prepare data for box plots (this part is done!)
    df_box = df.copy()
    df_box.reset_index(inplace=True)
    df_box['year'] = [d.year for d in df_box.date]
    df_box['month'] = [d.strftime('%b') for d in df_box.date]

    # Draw box plots (using Seaborn)
    # 1 row, 2 columns
    fig, axes = plt.subplots(1, 2, figsize=(15, 5))
    # Year-wise Box Plot (Trend)
    sns.boxplot(ax=axes[0], x="year", y="value", data=df_box)
    axes[0].set_title("Year-wise Box Plot (Trend)")
    axes[0].set_xlabel("Year")
    axes[0].set_ylabel("Page Views")

    # Month-wise Box Plot (Seasonality)
    sns.boxplot(ax=axes[1], x="month", y="value", data=df_box, order=["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"])
    axes[1].set_title("Month-wise Box Plot (Seasonality)")
    axes[1].set_xlabel("Month")
    axes[1].set_ylabel("Page Views")

    # Save image and return fig (don't change this part)
    fig.savefig('box_plot.png')
    return fig


# draw_line_plot()
# draw_bar_plot()
# draw_box_plot()
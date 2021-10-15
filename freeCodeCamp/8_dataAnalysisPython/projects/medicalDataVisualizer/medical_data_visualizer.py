import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np

# Import data
# df = pd.read_csv("medical_examination.csv", index_col=0)
df = pd.read_csv("medical_examination.csv")
# df.set_index("id", inplace=True)

# BMI - Body Max Index
# weight [kg] / height ** 2 [m^2]
bmi = df["weight"] / ((df["height"] / 100)**2)
# Add 'overweight' column
df['overweight'] = np.where(bmi > 25.0, 1, 0)

# Normalize data by making 0 always good and 1 always bad. If the value of 'cholesterol' or 'gluc' is 1, make the value 0. If the value is more than 1, make the value 1.
df["cholesterol"] = np.where(df["cholesterol"] > 1, 1, 0)
df["gluc"] = np.where(df["gluc"] > 1, 1, 0)


# Draw Categorical Plot
def draw_cat_plot():
    # Create DataFrame for cat plot using `pd.melt` using just the values from 'cholesterol', 'gluc', 'smoke', 'alco', 'active', and 'overweight'.
    df_cat = pd.melt(df,
                     id_vars=["cardio"],
                     value_vars=[
                         'active', 'alco',
                         'cholesterol', 'gluc', 'overweight', 'smoke'
                     ])

    # ----- (Asked but not necessary) ------
    # Group and reformat the data to split it by 'cardio'. Show the counts of each feature. You will have to rename one of the columns for the catplot to work correctly.
    df_cat["total"] = 1
    df_cat = df_cat.groupby(["cardio", "variable", "value"], as_index=False).count()
    fig = sns.catplot(x="variable", y="total", hue="value", kind="bar", col="cardio", data=df_cat).fig
    # -------------------------------------------
    
    # Draw the catplot with 'sns.catplot()'
    # fig = sns.catplot(x="variable",
    #                   hue="value",
    #                   kind="count",
    #                   col="cardio",
    #                   data=df_cat).set(ylabel="total").fig
    
    # Do not modify the next two lines
    # .fig of the catplot is required to pass the tests. It is what ables the acess to the get_xlabel methods and whatnots
    # aux = fig.axes[0]
    # print(aux.get_xlabel())
    fig.savefig('catplot.png')
    return fig


# Draw Heat Map
def draw_heat_map():
    # Clean the data
    
    # Diastolic pressure and systolic pressure
    # indexes = df[(df['ap_lo'] > df['ap_hi'])].index
    # df.drop(indexes, inplace=True)
    # # Height
    # indexes = df[(df['height'] < df['height'].quantile(0.025))].index
    # df.drop(indexes, inplace=True)

    # indexes = df[(df['height'] > df['height'].quantile(0.975))].index
    # df.drop(indexes, inplace=True)
    # # Weight
    # indexes = df[(df['weight'] < df['weight'].quantile(0.025))].index
    # df.drop(indexes, inplace=True)

    # indexes = df[(df['weight'] > df['weight'].quantile(0.975))].index
    # df.drop(indexes, inplace=True)

    df_heat = df[
      (df['ap_lo'] <= df['ap_hi']) &
      (df['height'] >= df['height'].quantile(0.025)) &
      (df['height'] <= df['height'].quantile(0.975)) &
      (df['weight'] >= df['weight'].quantile(0.025)) &
      (df['weight'] <= df['weight'].quantile(0.975))
    ]

    # Calculate the correlation matrix
    # df.reset_index(inplace=True)
    # corr = df.corr(method="pearson")
    corr = df_heat.corr(method="pearson")

    # Generate a mask for the upper triangle
    # mask = np.triu(np.ones_like(corr, dtype=bool))
    mask = np.triu(corr)

    # Set up the matplotlib figure
    fig, ax = plt.subplots(figsize=(11, 9))

    # Draw the heatmap with 'sns.heatmap()'
    sns.heatmap(corr, mask=mask, center=0, square=True, linewidths=1, annot=True, fmt=".1f")
    # Do not modify the next two lines
    fig.savefig('heatmap.png')
    return fig


# draw_cat_plot()
# draw_heat_map()
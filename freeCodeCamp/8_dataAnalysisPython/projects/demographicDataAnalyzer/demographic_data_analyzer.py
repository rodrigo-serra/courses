import pandas as pd
import numpy as np

def calculate_demographic_data(print_data=False):
    # Read data from file
    df = pd.read_csv("adult.data.csv")

    # How many of each race are represented in this dataset? This should be a Pandas series with race names as the index labels.
    race_count = df["race"].value_counts()

    # What is the average age of men?
    average_age_men = df.loc[df["sex"] == "Male", "age"].mean()
    average_age_men = np.round(average_age_men, 1)
    
    # What is the percentage of people who have a Bachelor's degree?
    aux = df["education"].value_counts(normalize=True)
    percentage_bachelors = aux["Bachelors"] * 100
    percentage_bachelors = np.round(percentage_bachelors, 1)

    # What percentage of people with advanced education (`Bachelors`, `Masters`, or `Doctorate`) make more than 50K?
    # What percentage of people without advanced education make more than 50K?
    # with and without `Bachelors`, `Masters`, or `Doctorate`
    higherEduIndex = (df["education"] == "Bachelors") | (df["education"] == "Masters") | (df["education"] == "Doctorate")
    
    higherEdu = df.loc[higherEduIndex, "salary"]
    higherEduPerc = higherEdu.value_counts(normalize=True)

    lowerEdu = df.loc[~higherEduIndex, "salary"]
    lowerEduPerc = lowerEdu.value_counts(normalize=True)
    # percentage with salary >50K
    higher_education_rich = higherEduPerc[">50K"] * 100
    lower_education_rich = lowerEduPerc[">50K"] * 100

    higher_education_rich = np.round(higher_education_rich, 1)
    lower_education_rich = np.round(lower_education_rich, 1)

    # What is the minimum number of hours a person works per week (hours-per-week feature)?
    min_work_hours = df["hours-per-week"].min()

    # What percentage of the people who work the minimum number of hours per week have a salary of >50K?
    min_hours_people = df.loc[df["hours-per-week"] == min_work_hours, "salary"]
    lazyStats = min_hours_people.value_counts(normalize=True)
    rich_percentage = lazyStats[">50K"] * 100
    rich_percentage = np.round(rich_percentage, 1)

    # What country has the highest percentage of people that earn >50K?
    workersByCountry = df["native-country"].value_counts()
    richPeopleByCountry = df.loc[df["salary"] == ">50K", "native-country"]
    richPeopleByCountryStats = richPeopleByCountry.value_counts()

    perc = richPeopleByCountryStats / workersByCountry

    highest_earning_country = perc.idxmax()
    highest_earning_country_percentage = perc.max() * 100
    highest_earning_country_percentage = np.round(highest_earning_country_percentage, 1)

    # Identify the most popular occupation for those who earn >50K in India.
    richIndians = df.loc[(df["native-country"] == "India") & (df["salary"] == ">50K"), "occupation"]
    richIndiansStats = richIndians.value_counts()
    top_IN_occupation = richIndiansStats.idxmax()

    # DO NOT MODIFY BELOW THIS LINE

    if print_data:
        print("Number of each race:\n", race_count) 
        print("Average age of men:", average_age_men)
        print(f"Percentage with Bachelors degrees: {percentage_bachelors}%")
        print(f"Percentage with higher education that earn >50K: {higher_education_rich}%")
        print(f"Percentage without higher education that earn >50K: {lower_education_rich}%")
        print(f"Min work time: {min_work_hours} hours/week")
        print(f"Percentage of rich among those who work fewest hours: {rich_percentage}%")
        print("Country with highest percentage of rich:", highest_earning_country)
        print(f"Highest percentage of rich people in country: {highest_earning_country_percentage}%")
        print("Top occupations in India:", top_IN_occupation)

    return {
        'race_count': race_count,
        'average_age_men': average_age_men,
        'percentage_bachelors': percentage_bachelors,
        'higher_education_rich': higher_education_rich,
        'lower_education_rich': lower_education_rich,
        'min_work_hours': min_work_hours,
        'rich_percentage': rich_percentage,
        'highest_earning_country': highest_earning_country,
        'highest_earning_country_percentage':
        highest_earning_country_percentage,
        'top_IN_occupation': top_IN_occupation
    }

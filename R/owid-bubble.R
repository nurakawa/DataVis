################################################################################
# title:            owid-bubble.R
# summary:          loads, cleans and aggregates data for the bubble scatterplot
#                   we get the mean absoluate mobility change (per month)
#                   and the mean new cases per million (per month) for the 
#                   European countries
################################################################################

# read in the OWID data
owid_data <- read.csv("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv",
                      header = TRUE)
# read in mobility data
mobility_data <- read.csv("https://raw.githubusercontent.com/ActiveConclusion/COVID19_mobility/master/summary_reports/summary_report_countries.csv",
                          header = T)

# select the European countries
european_countries <- c('Austria', 'Belgium', 'Bulgaria', 'Croatia',
                        'Cyprus', 'Czechia', 'Denmark', 'Estonia',
                        'Greece', 'Hungary', 'Iceland', 'Ireland',
                        'Italy', 'Latvia', 'Liechtenstein',
                        'Lithuania', 'Luxembourg', 'Malta',
                        'Netherlands', 'Norway', 'Poland', 'Portugal',
                        'Romania', 'Slovakia', 'Slovenia', 'Spain',
                        'Sweden', 'Switzerland', 'United Kingdom')           
  
owid_eu <- owid_data$location %in% european_countries
mobility_eu <- mobility_data$country %in% european_countries

# filter the European countries
owid_data <- owid_data[owid_eu,]
mobility_data <- mobility_data[mobility_eu,]

###############
# MOBILITY Data
###############
# compute mean ABSOLUTE change in mobility, daily
# this is the mean of absolute value of all mobility indicators

mobility_data[,'mean_abs_change'] = apply(mobility_data[,c(3:ncol(mobility_data))],
                                          1,
                                          #function(x){mean(sum(abs(x), na.rm = T))})
                                          function(x){mean(sum(x, na.rm = T))})

# select relevant columns
mobility_data <- mobility_data[,c('country', 'date', 'mean_abs_change')]
names(mobility_data)[1] <- 'location' # to match OWID

# keep only year 2020
get_year <- function(x){substr(x, 1,4)}
mobility_data[,'year'] = get_year(mobility_data$date)
mobility_data <- mobility_data[mobility_data$year == '2020',]

###########
# OWID Data
###########
# select relevant columns
names(owid_data)

cols_to_keep <- c('location','date','total_cases_per_million', "new_cases_per_million",
                  "new_tests_per_thousand", "positive_rate",
                  "new_deaths_per_million", "median_age")

# filter columns
owid_data <- owid_data[,cols_to_keep]

# get month
get_month <- function(x){substr(x,6,7)}
owid_data[,'month'] <- sapply(owid_data$date, get_month)

# get year
get_year <- function(x){substr(x, 1,4)}
owid_data[,'year'] <- sapply(owid_data$date, get_year)

# filter: only 2020
owid_data <- owid_data[owid_data$year == "2020",]

# select location, data, new_cases_per_million
owid_data <- owid_data[,c('location', 'date', 'month', 'new_cases_per_million')]


# join MOBILITY with the OWID data
require(tidyverse)
merged_df <- dplyr::inner_join(x = owid_data,
                              y = mobility_data,
                              on = c('location', 'date', 'month'))

merged_df$year = NULL


# awesome. Now we can summarize

merged_df <- merged_df %>%
  select(location, month, new_cases_per_million, mean_abs_change) %>%
  group_by(location, month) %>%
  summarize('new_cases' = mean(new_cases_per_million),
            'mobility_change' = mean(mean_abs_change))

# export
write.csv(merged_df, 'owid-data-europe.csv', row.names = FALSE)

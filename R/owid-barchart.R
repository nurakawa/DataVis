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

# select the dates of interest
dates_tokeep = c("2020-01-01","2020-01-06","2020-01-13","2020-01-20","2020-01-27",
                "2020-02-03","2020-02-10","2020-02-17","2020-02-24","2020-03-02", "2020-03-09",
                "2020-03-16", "2020-03-23", "2020-03-30", "2020-04-06", "2020-04-13", "2020-04-20", 
                "2020-04-27", "2020-05-04", "2020-05-11", "2020-05-18", "2020-05-25",
                "2020-06-01" ,"2020-06-08", "2020-06-15", "2020-06-22", "2020-06-29", "2020-07-06", 
                "2020-07-13", "2020-07-20", "2020-07-27", "2020-08-03", "2020-08-10",
                "2020-08-17","2020-08-24","2020-08-31","2020-09-07","2020-09-14","2020-09-21","2020-09-28",
                "2020-10-05","2020-10-12","2020-10-19","2020-10-26","2020-11-02","2020-11-09","2020-11-16", 
                "2020-11-23", "2020-11-30", "2020-12-07", "2020-12-14", "2020-12-21", "2020-12-28")

owid_data <- owid_data[owid_data$date %in% dates_tokeep,]

# select relevant columns
cols_to_keep <- c('location','date', "new_cases_per_million",
                  "new_deaths_per_million")

# keep continents
locations <- c('Asia', 'Africa', 'North America', 'South America', 'Australia', 'Europe')
owid_data <- owid_data[owid_data$location %in% locations,]

owid_data <- owid_data[,cols_to_keep]

owid_data <- owid_data[rowSums(is.na(owid_data)) < 1,]

require(tidyverse)

cases_df <- owid_data %>% group_by(date) %>%
  summarize('location_cases' = location[which.max(new_cases_per_million)],
              'location_deaths' = location[which.max(new_deaths_per_million)],
            'cases_per_million' = max(new_cases_per_million, na.rm=T),
            'deaths_per_million' = max(new_deaths_per_million, na.rm=T))

# sqrt scale
owid_data$new_cases_per_million = sqrt(owid_data$new_cases_per_million)
owid_data$new_deaths_per_million = sqrt(owid_data$new_deaths_per_million)

write.csv(owid_data, '/home/nkawa/nurakawa.github.io/DataVis/data/owid-data-barchart.csv', quote = FALSE, row.names = FALSE)


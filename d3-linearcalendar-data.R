################################################################################
# title:   d3-linearcalendar-data.R 
# author:  Nura Kawa
# summary: Downloaded data from 
#          https://www.ecdc.europa.eu/en/publications-data/download-data-response-measures-covid-19
#          and selected certain covid measures to keep.
#          output modified csv to use for D3 Linear Calendar.
# 
################################################################################

response_graph_df <- read.csv('/home/nkawa/nurakawa.github.io/DataVis/response_graphs_data_2021-04-15.csv',
                              stringsAsFactors = F)

levels_to_keep <- c("MasksMandatoryAllSpaces",
                    "WorkplaceClosures",
                    "Teleworking",
                    "SocialCircle",
                    "BanOnAllEvents",
                    "NonEssentialShops",
                    "EntertainmentVenues",
                    "RestaurantsCafes",
                    "StayHomeOrder")


# Keep only these measures
ind_keep <- response_graph_df$Response_measure %in% levels_to_keep
response_graph_df <- response_graph_df[ind_keep,]

# Filter dates in 2020
in_2020 <- grepl('2020', response_graph_df$date_start)
response_graph_df <- response_graph_df[in_2020,]

# Convert to factor
response_graph_df$Response_measure = factor(response_graph_df$Response_measure)

# Convert to Integer
response_graph_df[,'anyo'] = as.integer(response_graph_df$Response_measure)

# Convert start date format to match linearcalendar
response_graph_df[,'inicio'] = format(as.Date(response_graph_df$date_start),
                                      '%d-%m-%Y')

# Convert end date format to match linearcalendar
response_graph_df[,'fin'] = format(as.Date(response_graph_df$date_end),
                                      '%d-%m-%Y')

# Keep only necessary columns
response_graph_df <- response_graph_df[,c('anyo', 'inicio', 'fin', 
                                          'Response_measure', 'Country')]

# Export CSV
write.csv(response_graph_df,
          'response-graph.csv',
          row.names = F,
          fileEncoding = 'UTF-8',
          quote = F)


# Get Country List for Select Bar
countries <- unique(response_graph_df$Country)
sink('00-country-select-options.txt')  
for(i in 1:length(countries)){
  cat(paste0('<option value=\"',countries[i],'\">',
             countries[i],"</option> \n"))
}
sink()

# Get list of Response Measures
response_key <- unique(response_graph_df[,c("Response_measure", "anyo")])
rownames(response_key) <- NULL
sink('linear-calendar-response-key.txt')
response_key
sink()

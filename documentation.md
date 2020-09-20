## Process

I started by downloading the January 2018 data to get a feel for the size and fields in the data.  I set up a quick docker container with mysql on it and created 3 quick temporary tables, figuring I could import the csv data directly into those tables and then be able to get a better sense of the data.  Depending on the amount of data and performance, I would either combine the data in some fashion, or summarize it into a new table.  However, importing the csv data directly into those tables seemed like it was going to take 6+ hours, so I pivoted and decided to write a script to preprocess that data into a smaller set of summarized data.

Understanding that the total csv data (all 3 taxi types, but still only for January 2018) was around 20 million rows, my general goal with the summarize script was to combine that data into fewer rows.  My first iteration attempted to group the data by taxi type, pickup location id, dropoff location id, pickup date, and pickup hour.  However, after processing just the yellow data, I could see that this wasn't actually going to result in a smaller enough ratio of rows.  At the time, I had wanted to keep the delination of location id for extra data, but considering that filtering by borough was enough to fit the requirements, I decided to add a mapping to the summarizer to convert location id to borough id.  This ended up resulting in about 50k summarized rows containing data for:

- Average Passengers
- Total Passengers
- Average Distance
- Total Distance
- Total Trips
- Average Amount (fair)
- Total Amount

I set up a couple of additional containers for the back end and the front end.  The back was set up as an API to serve the summarized data to the front end for the purposes of the graph (or whatever else).

## Technical Decisions

MySQL was mostly a choice of ease.  I have confidence in using it and knew it would support the solution.

Express and Sequelize were new to me.  I have a good amount of confidence with JS and Node, and figured this would be a fun opportunity to learn some new frameworks.  Overall, Express and Sequelize were pretty straight forward to set up and get running in order to provide some basic endpoints to fetch data from the database.  The additional filters were also pretty straight forward to add to the route and pass on to the Sequelize findAll function.

I have some decent experience with Vue.js, but Chart.js was new to me.  I knew that I wanted to provide a chart to display some of the summarized data, and Chart.js seemed like a popular and modern library that could accomplish that.  Getting the bar chart displaying correctly was mostly a matter of formatting the data correctly.

I have some experience with Docker, but this was a fun opportunity to use it.  I used Docker mainly for the purpose of making the development process easier.  Having a pristine environment with the correct technologies installed reduced the requirements necessary for my local development machine.  Additionally, it should facilitate the ease of setup for other developers.  If anybody doesn't want to use Docker, it should still be pretty simple to get the app running on a dev machine by getting Node.js and MySQL going.

## Onward

There are a few things I would be interested in doing given more time to spend on the project:

- Additional charts:
  - Average Fare Per Minute By Hour of Day (Broken down by Taxi Type)
  - Some missing information that would be useful to have would be some sort of metrics around the length of time people search for or wait for rides given the different taxi types.  It is difficult to ascertain from the given information which taxi type would be the quickest to use at a given time.  Does a high number of trips for a certain taxi type at a given hour mean that they have a lot of availability?  Or that they are all booked?  Or neither?
- More data!  Building out the data import process further to ensure that more of the data could be added would be great.  It would provide further comparisons for the charts across different times of the year.  It would potentially mean adding more flexibility to the import process in case columns, data types, or the data overall changes.
- Additional endpoints and filters, which would allow more flexibility in accessing the data to ease the creation of additional charts or other types of features.
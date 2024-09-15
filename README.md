# TIME WELL SPENT

## Description
One of humanity's greatest strengths is the yearning to help those who need it.  Small, simple, random acts of kindness inhabit our days in ways we cannot even see, but they're there, making our time on this earth that little bit easier, just when we need it.  However, as we venture further into the future, and further from each other, finding opportunities to help others in more substantial ways becomes more difficult.

[TIME WELL SPENT](https://morning-wildwood-88697.herokuapp.com/) is an application designed to connect users to charities and nonprofits in need of help.  Charities will be able to post repeating or singular events on their pages, and users will be able to discover them using our search feature or google maps integration.  Once charities are discovered, users can volunteer for posted events or donate directly to that charity.  With greater access to altruistic opportunities, connections with others will strengthen and communities grow.


## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)


## Installation

Once the github has been cloned, the following technologies are required using 'npm install':
- react
- express
- nodemon
- tailwind
- graphql
- daisyui
- Google onetap

Other technologies required are Sequelize, Node.js and Insomnia.  

Finally, technologies used to create the project include Stripe and Heroku, which was used to publish the website.


## Usage

When following the link posted below, the user is presented with a homepage showing nearby charities and events they're holding.  The user can click on the events and be brought to the event page, or click discover to refine their search.  If the user wants to volunteer, they must first sign up through the site or with Google.  If they commit to volunteering at one of the posted events, the selected event is added to their google calendars.  

If the user is not a volunteer, but a charity or nonprofit, they can sign up as such and create events.  A create event button will redirect them to a page that allows them to create and edit their volunteer opportunities, noting time, date and requirements.  Once created, a list of volunteers will appear on the event page as they sign up.

Both Volunteers and Charites/Nonprofit profile pages are unique.  Volunteer pages allow for charities to make sure their volunteers are what they're looking for, and the charity pages have a donation button that allow users to donate to that charity via STRIPE integration.


## Screenshot

![Screenshot](/client/public/assets/screenshot1.png)
![Screenshot](/client/public/assets/screenshot2.png)
![Screenshot](/client/public/assets/screenshot3.png)
![Screenshot](/client/public/assets/screenshot4.png)


## Links

* Video demo 1: https://youtu.be/qj8QTrw9Jpk 
* Video demo 2: https://youtu.be/GD4ajuFWtYM
* [The site](https://morning-wildwood-88697.herokuapp.com/)   
* Github: https://github.com/TotallyReactingNodeTurtles/timewellspent 


## Credits

* Matthew Fischer - https://github.com/MfischerTurtle 
* Grace Yao - https://github.com/gyao1487 
* James Ioriatti - https://github.com/JIoriatti
* Mark Calcagno - https://github.com/mcalcagno47


## Future Development

We hope to return to this project one day to add community features, allowing users earn badges and public achievements for volunteering at different numbers of events and donating different amounts of money.  

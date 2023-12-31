# Objective

Brainstorm is a web application that serves as a way for groups of people to collaborate and come up with ideas for projects of any kind. Users can send text to one another like in any chat room, but with the added option of conducting brainstorming sessions whenever they want. Brainstorming sessions allow chat members to contribute ideas, critique them, and take a vote to preserve the ideas they like the most. The ultimate goal of Brainstorm is to provide a virtual platform that makes brainstorming fast, easy, and fun for all.

<br>

# Team Members
| Name            | GitHub Username |
| :-----:         | :-----:         |
| Akira Cooper    | nagaokakid      |
| Roland Fehr     | rfehr-creator   |
| Kao Yee Tsung   | Jackson-kao97   |
| Ravdeep Singh   | singhr27        |

<br>

# Getting Started
To run the Brainstorm app, perform the following steps: <br><br>
### 1. Clone the remote repository
Navigate to a directory on your local machine where you would like to store a local copy of this project. Run one of the following commands:
<br><br>Clone via HTTPS<br>
`git clone https://github.com/nagaokakid/brainstorm.git`
<br><br>Clone via SSH<br>
`git@github.com:nagaokakid/brainstorm.git`
<br>
<br>
### 2. Create and run the docker containers
First, ensure that you have [Docker](https://docs.docker.com/get-docker/) installed on your machine. If you have previously created docker images from this project, delete them first before proceeding further. In the root directory of your local copy of this project, run the following command: <br><br>`docker compose up`
<br>
<br>
### 3. Navigate to the web page
On a web browser, go to the app's home page by entering the following URL: <br><br>`http://localhost:8006/`
<br>
<br>
### Enjoy!
<br>

# User Guide
To view the user guide for this app, click here [here](https://github.com/nagaokakid/brainstorm/wiki/User-Guide).

<br>

# Project Proposal
To view the project proposal, click [here](https://github.com/nagaokakid/brainstorm/wiki/Project-Proposal).

<br>

# Architecture
To view the architecture diagram for this project, click [here](https://github.com/nagaokakid/brainstorm/wiki/Architecture-Diagram).

<br>

# Sequence Diagrams
To view the sequence diagrams for this project, click [here](https://github.com/nagaokakid/brainstorm/tree/main/Sequence%20Diagrams).

<br>

# Testing Plan
To view the testing plan for the app, click [here](https://github.com/nagaokakid/brainstorm/blob/main/Brainstorm_Test_Plan.pdf).

<br>

# End-To-End Testing
If you would like to run the simulated acceptance tests for this project, clone the repository and ensure you have [Node and npm installed](https://radixweb.com/blog/installing-npm-and-nodejs-on-windows-and-mac). Go to the directory named *FrontEnd* for this project. Now, run the command `npm install` to install the necessary front-end dependencies. Then, run the command `npm run e2e` to run the tests.

<br>

# Load Testing
Ensure the docker containers are running. Open the project repository on the command line, then navigate to the directory *LoadBalancing/apache-jmeter-5.6.2/bin*. Now, run the command `jmeter -n -t ../../app_load_test.jmx -l [resultsLogName].jtl -e -o [reportOutputName]` (use ./jmeter if you're using Windows Powershell). Replace [resultsLogName] and [reportOutputName] with whatever you like, just ensure the names don't already exist. This command will run the JMeter test and generate both a [resultsLogName] log file and a [reportOutputName] report output folder. Navigate to the report output folder and open the *index.html* file to see the full visual report and analytics for the JMeter test.

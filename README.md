# Flow
1. User goes to root page
1. Page displays all available comics
1. User clicks a comic
1. Page displays all comics in that feed

# Glossary
Code should adhere to this naming because it's extremely easy to use these terms in varying ways. `comic` can easily be understood to mean any series of comics or a single episode within a series.  

* `comic` A single series. Example: Dilbert
* `comics` Generalized word referring to multiple series of comics. Example: Dilbert, Channelate, etc
* `episode` An entry in a series. Example: June 1st, 2017 and its corresponding image

# Questions
* How to deploy?
    * https://github.com/fullstackreact/food-lookup-demo#deploying
* What to do when an image download fails?
    * Retry? Flag episode and report to UI?
    * How to resolve?

# Features
### Priority - High
* Populate UI from image paths from the db and not the feed
    * This sets up add metadata to each comic image too


### Priority - Medium
* How to use LESS with create-react-app, if possible
* How to handle UI errors? Unhandled promise error when server returns 500
* How to handle node request errors?
* How to mark as read?
    * Cleanup after?

### Priority - Low


# Bugs

### Priority - High

### Priority - Medium

### Priority - Low

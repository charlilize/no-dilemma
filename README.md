# Web Development Final Project - *NoDilemma*

Submitted by: **Charlize Angeles**

This web app: **A forum website where people create, edit, and comment on posts. Each post has a built-in poll, allowing people can ask each other for advice or opinions anonymously!**

Time spent: **15** hours spent in total

## Required Features

The following **required** functionality is completed:

- [X] **A create form that allows the user to create posts**
- [X] **Posts have a title and optionally additional textual content and/or an image added as an external image URL**
- [X] **A home feed displaying previously created posts**
- [X] **By default, the time created, title, and number of upvotes for each post is shown on the feed**
- [X] **Clicking on a post shall direct the user to a new page for the selected post**
- [X] **Users can sort posts by either their created time or upvotes count**
- [X] **Users can search for posts by title**
- [X] **A separate post page for each created post, where any additional information is shown is linked whenever a user clicks a post**
- [X] **Users can leave comments underneath a post on the post's separate page**
- [X] **Each post should have an upvote button on the post's page. Each click increases its upvotes count by one and users can upvote any number of times**
- [X] **A previously created post can be edited or deleted from its post page**

The following **optional** features are implemented:

- [X] Users can only edit and deleted posts or delete comments by entering the secret key, which is set by the user during post creation
- [ ] Upon launching the web app, the user is assigned a random user ID. It will be associated with all posts and comments that they make and displayed on them.
- [ ] Users can repost a previous post by referencing its post ID. On the post page of the new post, the referenced post is displayed and linked, creating a thread
- [ ] Users can customize the interface of the web app
- [ ] Users can share and view web videos
- [ ] Users can set flags while creating a post. Then users can filter posts by flags on the home feed.
- [ ] Users can upload images directly from their local machine as an image file
- [X] Display a loading animation whenever data is being fetched

The following **additional** features are implemented:

* [X] Each post has a poll and the total number of votes on each option is kept track of
* [X] Added an API where every time a user comments, they are assigned a random username

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='http://i.imgur.com/link/to/your/gif/file.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

<!-- Replace this with whatever GIF tool you used! -->
GIF created with ...  
<!-- Recommended tools:
[Kap](https://getkap.co/) for macOS
[ScreenToGif](https://www.screentogif.com/) for Windows
[peek](https://github.com/phw/peek) for Linux. -->

## Notes

I had the most problems with the polls aspect of my website. Adding poll options on the front end and the back end was challenging as I had to keep track of which polls and posts it belonged to on Supabase. Especially when I was building the editing post portion of my website, it was hard because, in addition to showing the current poll options, I had to add options, too. Overall, there were many layers to building a poll from scratch that I didn't expect. Also, adding conditions that ensure posts don't have faulty values was difficult. The CSS was also tedious working on this project as I tried using a component library that sometimes worked unexpectedly, so I had to work around those hurdles as well. In this course, this project has taken me the longest by far.

## License

    Copyright 2024 Charlize Angeles

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

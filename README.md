# Hi!

This is a simple web app project using Flask, BootStrap and jQuery to get some basic information from Reddit. The basic information consists of the top few used words in the titles of hot submissions. User data is saved to a MongoDB NoSQL database and can point to either a local database or an Atlas database.

If you wish to run this, follow these steps:
<ol>
  <li>Create a file called "SuperSecretCredentials.txt" and place it in the root folder alongside "flask_site.py"
  <li>Insert the following into the file:
  
  ```
  <Your client_id from Reddit>
  <Your client_secret from Reddit>
  <user_agent>
  ```
  These can be found by creating a Reddit account, going to the account preferences section and creating an app (personal script)
  <li>Run "flask_site.py"

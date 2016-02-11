# Autocrud

Autocrud is an AngularJS & AngularUI Bootstrap based HTML tool for creating CRUD operations by defining the data model on a JSON.

# 1. Dependencies:

Autocrud depends on [Twitter Bootstrap], [Angular UI Bootstrap], [Pagination Directive] and [bootstrap-dialog].

**Unfortunately**, Angular UI Bootstrap didn't met our requirements, so we had to make changes to their tool. Therefore, it is **recommended** to use the Angular UI Bootstrap included in Autocrud. The changes made are explained there, so if you want to use a newer version of Angular UI Bootstrap, you shouldn't have much trouble adapting it to accomodate Autocrud.

# 2. Instalation:

Please make sure you have met all of the requirements above.

Installation is fairly easy. Unzip the file in your project (e.g. app/assets/plugins/) so that you have the folder named "autocrud" (e.g. app/assets/plugins/autocrud).

Then, include all js and css files in your html page. Or, you can include only the .min.js and .min.css

# 3. Usage:

To use the tool, you need to include the angular dependency 'auto-crud' (e.g. var app = angular.module('myModule', ['auto-crud']).

Also, you can/must specify some options and configuration:

## 3.1 Paginate Options:

Please check [Pagination Directive] project for supported options if you want to customize it's behavior. These options should be declared in a JSON, for example

``` javascript
{
    itemsPerPage: 10
}
```

## 3.2 Object Properties: 

Properties mosted related to URLs of the object you're *cruding* and what needs to be send apart from the data of the form. For example:
  
    ```javascript
    {
        name: 'client',
        baseUrl: 'clients',
        uniqueUrl: 'unique',
        creates: {
            url: 'new',
            also: {
                utf8: 'true',
                authenticity_token: 'a token here'
            }
        },
        edits: {
            url: ':id',
            method: 'patch',
            also: {
                utf8: true,
                authenticity_token: 'a token here'
            }
        },
        deletes: {
            url: ':id',
            method: 'delete',
            also: {
                authenticity_token: 'a token here'
            }
        }
    }
    ```
    this example above tell us that when we are creating a "client", the url where the form will be sent will be "/clients/new" (baseUrl + creates.url). Also, the properties utf8 and authenticity_token will be sent along with the form data. You can specify the method for the requests, specify what will be send along with each request, and you can specify attributes to compose the url (:id, :name, etc). If you have an attribute that is a unique index, you can specify the url for the server to make the verification. In the example above, it will be "clients/unique"
    
    If you don't want to make the user able to delete, just remove the "delete" property of the json. Same goes with create and edit. **Beware**, though, that it limits only the front end. You must have validation on the back end.
    
## 3.3 Attributes:

The attributes of your object, and it's description, declared in a JSON:

  - name: The name of the attribute (e.g.: name, address, phone_number, birthDate, etc)
  - list (default *true*): Tells if the attribute should be listed.
  - label: The name of the attribute that will be shown to the user (e.g.: Name, Address, Phone number, Birth date, etc).
  - tab: A string that tells on which tab of the form this attribute should be in (e.g.: 'General Information', 'Personal Information', 'Stats', etc).
  - array (default *false*): Tells if the input is an array, i.e., if you can have multiple values.
  - arrayMinLength: If the input is array, this defines the minimum elements you should have.
  - arrayMaxLength: If the input is array, this defines the maximum elements you should have.
  - error: Message to be shown to the user if input has error. Can be a string or an array (e.g.: ['Name should have between 4 and 32 letters', 'No numbers are allowed']).
  - description: Array that describes the input. The first element should be a string that represents the type of the attribute. Supported attributes are:
    - id
    - checkbox
    - composition (see info below)
    - custom (see info below)
    - date
    - datetime
    - email
    - file
    - float
    - number
    - int
    - password
    - phone
    - price
    - select
    - text
    - textarea
    - time
    - typeahead
    
    If the input is "typeahead" or "select", it must also have the "options" property, which must be an array of strings or objects with "label" and "value" properties.

    For "file" attributes, you can provide a second element to the array, 'image', that tells if the file is image.
    All the other elements in the "description" will be translated to the HTML element's attribute. For example: 'style=background-color: red; font-size: 14px' will be translated to "style='background-color: red; font-size: 14px'".
    
    If there is some kind of input that Autocrud does not handle the way you want, you can have "custom" attributes, in which you have to provide the property "html" which contains the html for the form element.

    Also, there are custom descriptions you can add, such as:
    
      - For date and datetime only:
        - mindate
        - maxdate
        - nopast
        - nofuture
        
      - For arrays of selects and typeaheads only:
        - no-repeat

Markdown is a lightweight markup language based on the formatting conventions that people naturally use in email.  As [John Gruber] writes on the [Markdown site][df1]

> The overriding design goal for Markdown's
> formatting syntax is to make it as readable
> as possible. The idea is that a
> Markdown-formatted document should be
> publishable as-is, as plain text, without
> looking like it's been marked up with tags
> or formatting instructions.

This text you see here is *actually* written in Markdown! To get a feel for Markdown's syntax, type some text into the left window and watch the results in the right.

### Version
3.2.0

### Tech

Dillinger uses a number of open source projects to work properly:

* [AngularJS] - HTML enhanced for web apps!
* [Ace Editor] - awesome web-based text editor
* [Marked] - a super fast port of Markdown to JavaScript
* [Twitter Bootstrap] - great UI boilerplate for modern web apps
* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework [@tjholowaychuk]
* [Gulp] - the streaming build system
* [keymaster.js] - awesome keyboard handler lib by [@thomasfuchs]
* [jQuery] - duh

And of course Dillinger itself is open source with a [public repository][dill]
 on GitHub.

### Installation

You need Gulp installed globally:

```sh
$ npm i -g gulp
```

```sh
$ git clone [git-repo-url] dillinger
$ cd dillinger
$ npm i -d
$ mkdir -p downloads/files/{md,html,pdf}
$ gulp build --prod
$ NODE_ENV=production node app
```

### Plugins

Dillinger is currently extended with the following plugins

* Dropbox
* Github
* Google Drive
* OneDrive

Readmes, how to use them in your own application can be found here:

* [plugins/dropbox/README.md] [PlDb]
* [plugins/github/README.md] [PlGh]
* [plugins/googledrive/README.md] [PlGd]
* [plugins/onedrive/README.md] [PlOd]

### Development

Want to contribute? Great!

Dillinger uses Gulp + Webpack for fast developing.
Make a change in your file and instantanously see your updates!

Open your favorite Terminal and run these commands.

First Tab:
```sh
$ node app
```

Second Tab:
```sh
$ gulp watch
```

(optional) Third:
```sh
$ karma start
```

### Todos

 - Write Tests
 - Rethink Github Save
 - Add Code Comments
 - Add Night Mode

License
----

MIT


**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does it's job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [Angular UI Bootstrap]: <https://github.com/angular-ui/bootstrap>
   [Pagination Directive]: <https://github.com/michaelbromley/angularUtils/tree/master/src/directives/pagination>
   [bootstrap-dialog]: <https://github.com/nakupanda/bootstrap3-dialog>
   [dill]: <https://github.com/joemccann/dillinger>
   [git-repo-url]: <https://github.com/joemccann/dillinger.git>
   [john gruber]: <http://daringfireball.net>
   [@thomasfuchs]: <http://twitter.com/thomasfuchs>
   [df1]: <http://daringfireball.net/projects/markdown/>
   [marked]: <https://github.com/chjj/marked>
   [Ace Editor]: <http://ace.ajax.org>
   [node.js]: <http://nodejs.org>
   [Twitter Bootstrap]: <http://twitter.github.com/bootstrap/>
   [keymaster.js]: <https://github.com/madrobby/keymaster>
   [jQuery]: <http://jquery.com>
   [@tjholowaychuk]: <http://twitter.com/tjholowaychuk>
   [express]: <http://expressjs.com>
   [AngularJS]: <http://angularjs.org>
   [Gulp]: <http://gulpjs.com>
   
   [PlDb]: <https://github.com/joemccann/dillinger/tree/master/plugins/dropbox/README.md>
   [PlGh]:  <https://github.com/joemccann/dillinger/tree/master/plugins/github/README.md>
   [PlGd]: <https://github.com/joemccann/dillinger/tree/master/plugins/googledrive/README.md>
   [PlOd]: <https://github.com/joemccann/dillinger/tree/master/plugins/onedrive/README.md>



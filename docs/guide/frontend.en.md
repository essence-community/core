# Front-end

[Русский](frontend.md)

Catalog describing Front-end components and settings


## Constructor

The Constructor is a framework, i.e. a software platform that defines the structure
of a software project; it simplifies development and the combination of several components Attribute
of the project. Class

### Object

The purpose of the Constructor is to simplify and speed up development of a software Page
product. The Constructor provides a hierarchy and a set of typical components from
which any software product can be "assembled".


Metamodel structure
Main components:

1. Class;
2. Object;
3. Page.


### Attribute

![Attribute](images/p019-01.jpg)

![Attribute](images/p020-01.jpg)

![Attribute](images/p020-02.jpg)

![Attribute](images/p021-01.jpg)

![Attribute](images/p021-02.jpg)

An attribute is a property of a class or an object.
Creating an attribute
Each class has a corresponding set of attributes. Attribute types
Editing an attribute
Deleting an attribute
Used in which classes

Creating an attribute
To create an attribute:

1. go to the "Attributes" page (Menu -> CORE -> GUI Constructor -> Classes);
2. click the "Create attribute" button;


3. fill in the fields;
4. click the "Save" button.


Available fields:

Field name Data type Comments

Name Text Required.

Description Text

Attribute type Selection from a list


Attribute types
There are several attribute types:

Name Description

basic a regular attribute

behavior a behavioral attribute for display depending on data. Overridden only on
pages.

system a system attribute, not overridden for an object/page

placement a place to put a child element

view an attribute that affects visualization


Editing an attribute
To edit an attribute:

1. select the attribute;

2.

2. click the "Edit value" button-column;
3. make the required changes;
4. click the "Save" button.


Deleting an attribute
To delete an attribute:

1. select the attribute;
2. click the "Delete" button;
3. confirm deletion by clicking the "Yes" button.


> **Important!**
> If the attribute is assigned to any class, the system will return an error: "Attribute is used in [Class
> name]".


To delete such an attribute, first remove the attribute-to-class binding, then delete the
attribute itself.


Used in which classes
To view the classes that use a given attribute:

1. go to the "Attributes" page (Menu -> CORE -> GUI Constructor -> Classes);
2. select the attribute for which you need the list of using classes;
3. the "Used in which classes" grid will display the list of classes that use the selected attribute.


### Class



![Class](images/p022-01.jpg)

![Class](images/p022-02.jpg)

![Class](images/p023-01.jpg)

![Class](images/p023-02.jpg)

![Class](images/p024-01.jpg)

![Class](images/p024-02.jpg)

![Class](images/p025-01.jpg)

![Class](images/p025-02.jpg)

![Class](images/p025-03.jpg)

A class is a basic Constructor component.
Creating a class
It is an object template with a set of attributes and Editing a class
their values. Deleting a class
Adding class attributes
Child and parent classes


Creating a class
To create a class:

1. go to the "Classes" page (Menu -> CORE -> GUI Constructor -> Classes);
2. click the "Create" button;


3. fill in the fields;

4. click the "Save" button.


Available fields:

Field name Data Comments
type

Name Text Required.

Description Text

Displayed dataset flag Yes/No Whether a service can be bound to an object of the class.

Standalone filling flag Yes/No Whether an object of the class can be a top-level object, or it must
have a parent.


Editing a class
To edit a class:

1. select the class;
2. click the "Edit value" button-column;
3. make changes;
4. click the "Save" button.


Deleting a class
To delete a class:

1. select the class;
2. click the "Delete" button;
3. confirm deletion by clicking the "Yes" button.

3.


> **Important!**
> If an object of the class being deleted exists, the system will return an error: "Class deletion is impossible because
> related records exist".


To delete such a class, first delete the object of this class, then delete the
class itself.


Adding class attributes
After creating a new class, a set of attributes is added for it. To do this:

1. select the class for which attributes will be created;
2. select the "Attributes" tab;
3. click the "Add" button;


4. fill in the fields;

5. click the "Save" button.


Available fields:

Field name Data type Comments

Name Selection from a list

Value Text

Required flag Yes/No

Description Filled in automatically on save.

Attribute type Filled in automatically on save.


Child and parent classes
The class hierarchy can be configured by adding child classes.

For each class, child classes can be bound. To do this:

1. select the class to which child classes will be added;
2. select the "Child classes" tab;
3. click the "Add" button;


4. fill in the fields;
5. click the "Save" button.

Available fields:

Field name Data type Comments

Class attribute Selection from a list The list of available values depends on the selected parent class

Class Selection from a list The list of available values depends on the selected parent class


The list of parent classes of the selected class is shown on the "Parent classes" tab.


### Object




![Object](images/p026-01.jpg)

![Object](images/p026-02.jpg)

![Object](images/p027-01.jpg)

![Object](images/p028-01.jpg)

![Object](images/p028-02.jpg)

![Object](images/p029-01.jpg)

![Object](images/p029-02.jpg)

![Object](images/p029-03.jpg)

![Object](images/p030-01.jpg)

Creating an object
An object is an instance of a class with a given set of attributes. Editing an object
Cloning an object
Deleting an object
Overriding object attribute values


Creating an object
To create an object:

1. go to the "Objects" page (Menu -> CORE -> GUI Constructor -> Objects);
2. select the parent object or the root catalog and click the "Create" button;


3. fill in the fields of the modal window that appears;

4. click the "Save" button.


Available fields:

Field name Data type Comments

Class Selection from a list Required.

Service Selection from a list

Object name Text Required.

Object description Text Required.

Sort order Number Required.

Displayed name Text

Modification method Text

Data provider on modification Selection from a list Filled in only when Modification method is specified.


Editing an object
To edit an object:

1. select the object;
2. click the "Edit value" button-column;

3. make the required changes;
4. click the "Save" button.


Cloning an object
Cloning creates an exact copy of the object with all of its child objects and overridden
attribute values. The cloned object name will have the prefix "COPY of ".

To clone an object:

1. select the object;
2. click the "Clone object" button;

3. in the modal window that appears, select the parent object in which the cloned copy will be created. If you need to create the copy in the root catalog, clear the "Parent object" field;


4. click the "Clone" button.


> **Important!**
> When cloning an object, a check is performed against the Class Hierarchy.


If the class of the cloned object is not a child of the parent object's class, the system will return an error:
"Child objects can be added only when a link exists in t. C_Class hierarchy".


Deleting an object
To delete an object:

1. select the object;
2. click the "Delete" button;
3. confirm deletion by clicking the "Yes" button.


> **Important!**
> If the object is used on any page, the system will return an error: "Object deletion is impossible because
> an object-to-page binding exists".


To delete such an object, first remove the object binding on the page, then delete the
object itself.


Overriding object attribute values

After creating an object, its attribute values can be overridden if needed. An overridden attribute
value on an object takes priority over the attribute value on the class.

To override an attribute value on an object:

1. select the object on the "Objects" page;
2. select the required attribute on the "Object attributes" tab and click the "Edit value" button-column;

3. enter the overridden object attribute value;
4. click the "Save" button.


To edit an overridden object attribute value:

1. select the attribute;
2. click the "Edit value" button-column;
3. enter the new value;
4. click the "Save" button.

To delete an overridden object attribute value, select the attribute and click the "Delete" button.


### Page





![Page](images/p031-01.jpg)

![Page](images/p031-02.jpg)

![Page](images/p031-03.jpg)

![Page](images/p032-01.jpg)

![Page](images/p033-01.jpg)

![Page](images/p034-01.jpg)

![Page](images/p034-02.jpg)

![Page](images/p035-01.jpg)

![Page](images/p035-02.jpg)

![Page](images/p036-01.jpg)

![Page](images/p037-01.jpg)

![Page](images/p038-01.jpg)

![Page](images/p038-02.jpg)

Creating a page
A page is the top component in the constructor object hierarchy; it includes Editing pages
objects and attributes. Deleting pages
Cache reset
Page types: Adding objects to a
page
1. Module - An abstract concept representing a large functional part Editing of the system; it includes catalogs and pages; objects on a page 2.

2. Catalog - a semantic section that "groups" pages and nested Deleting an object from catalogs; a page
3. Page - a basic section containing objects. Add objects to a catalog Masters Updating object bindings on a page Overriding object attributes on a page

### Global variables

on a page


Creating a page
To create a page:

1. go to the "Pages" page (Menu -> CORE -> GUI Constructor -> Pages);
2. select the parent module/catalog or the root catalog in which the page will be created;
3. click the "Create" button;


4. fill in the fields of the modal window that appears;

5. click the "Save" button.


Available fields:

Field name Data type Comments

Name Text Required.

Type Selection from Required.
a list

Order Number Required.

Icon Selection from
a list

View action code Number Filled in only for type "Page".

Modification action Number Filled in only for type "Page".
code

Show in menu Yes/No Whether to show the page (catalog/module) in the Menu.

Static page Yes/No Whether the page is static.

Link Text Address of the static page.

Filled in only when "Static page" = "Yes".

Allowed characters: [0-9],[a-z],[A-Z],[_],[-].

For example, if the value is "test", the page link will be: http://address
/page/test


Creating a catalog and a module is similar to creating a page.

Editing pages
To edit a page:

1. select the page;
2. click the "Edit value" button-column;


3. make the required changes;
4. click the "Save" button.


Deleting pages
To delete a page:

1. select the page;
2. click the "Delete" button;
3. confirm deletion by clicking the "Yes" button.


> **Important!**
> If any object has been added to the page, the system will return an error: "There are objects bound to
> this page. You must first remove the binding"


To delete such a page, first remove the object binding, then delete the page itself.

Cache reset
To reduce the number of DB requests and improve performance, all page content is cached on the first
open.

After changing page settings (editing the page itself, adding/editing/deleting objects on
the page, updating bindings, etc.), you must reset the cache.

To do this:

1. go to the "Pages" page (Menu -> CORE -> GUI Constructor -> Pages);
2. click the "Reset cache on the gateway" button;
3. confirm the reset by clicking the "Yes" button;


4. wait for the technical work related to the reset to complete.


Adding objects to a page
After creating a page, you can start adding objects. To do this:

1. select the created page;
2. click the "Add" button;


3.

3. fill in the fields of the modal window that appears;
4. click the "Save" button.


Available fields:

Field name Data type Comments

Object Selection from a list Required.

Order Number Required.

Master selection Selection from a list Used to set a dependency between objects.


Editing objects on a page
To edit an object on a page:

1. select the object;
2. click the "Edit value" button-column;
3. enter the new value;
4. click the "Save" button.


Deleting an object from a page
To delete an object on a page:

1. select the object;
2. click the "Delete" button;
3. confirm deletion by clicking the "Yes" button.


> **Important!**
> If the object being deleted or its child object is a master for another object on the page, the system
> will return an error: "There is an object "object name" linked via the master object ID".


To delete such an object, first remove the link to the dependent object, then delete
the object itself.


Masters
Within a single page, an object dependency can be configured. The main object that affects other objects is
the master. Each object can have only one master. A master can have an unlimited number of dependent
objects on the page.

Interaction between the master and the dependent object can be configured with attributes:

Name Description

disabledemptym Lock flag if the master returned an empty value
aster

getmastervalue Name of the parameter from the master that will be passed in json as "master":
{"parameter_name":"value"}

reloadmaster Flag to refresh the parent by master

reloadservice Flag to call the combobox service again on expand if the master has changed

reqsel Flag of dependency on the master (true/false)


Updating object bindings on a page
If changes were made to an object already used on a page (for example, new
child objects were added), the object bindings on the page must be updated. In this case all changes
will appear on the page.

To update the binding:

1. select the page on which object bindings need to be updated;
2. click the "Update object binding" button-column;
3. confirm the update by clicking the "Yes" button;


4. click the "Reset cache on the gateway" button;
5. confirm the reset by clicking the "Yes" button.

Overriding object attributes on a page
After adding objects to a page and configuring masters, you can, if needed, override
object attribute values on the page. An overridden object attribute value on a page takes priority over the
attribute value on the object.

Overriding an object attribute value on a page is similar to overriding an attribute value on an object (lin
k).

Global variables on a page
Within a single page, a list of global variables must be defined. Details

To create a global variable on a page:

1. select the page;
2. go to the "Global variables on the page" tab;
3. click the "Add" button;


4. fill in the fields;

5. click the "Save" button.


To edit a global variable:

1. select the global variable;
2. click the "Edit value" button-column;
3. enter the new value;
4. click the "Save" button.

To delete a global variable, select the global variable and click the "Delete" button.


> **Important!**
> If the global variable is used on the page, the system will return an error: "Variable deletion
> is impossible because it is still used on the page".


To delete such a global, first remove the binding from objects that set/get this global
variable, then delete the global itself.


## Interface and controls

The Constructor user interface (graphical interface) consists of standard elements such as: buttons,
menus, tabs, filters, navigation and control panels, etc.

The user interface is available in two variants: "Light theme" and "Dark theme". Theme selection does not affect
function execution and is made for the convenience of a particular user. The main differences between themes are color, font and
component solutions, as well as the placement of control panels. By default, on the user's first
authorization the "Light theme" is loaded; on subsequent authorizations — the theme selected by the user.


### Authorization

![Authorization](images/p039-01.jpg)

![Authorization](images/p039-02.jpg)

To enter the system you must
complete authorization on the start
page of the system. Enter the
login and password in the input fields, then click
"Sign in". Until the fields are
filled in, this button will be
inactive.

Characters of the entered password will be
hidden.


To view the password,
hover the cursor over the password
input field; the "eye" and "cross" icons
will appear on the right. Click the
"eye" icon. You can hide the password
by clicking the "eye" again.


### Global panel





![Global panel](images/p040-01.jpg)

![Global panel](images/p040-02.jpg)

![Global panel](images/p040-03.jpg)

![Global panel](images/p040-04.jpg)

![Global panel](images/p040-05.jpg)

![Global panel](images/p040-06.jpg)

The Constructor has a global static panel at the top of the page, consisting of the following elements
(left to right):

1. Button to open the quick access section
2. Button to open the main menu section
3. Tab navigation buttons
4. Tab area
5. Button to open the notifications section
6. Button to open the user profile
7. Button to open program information


1. Button to open the quick access section The button opens a side menu with tabs that the user has marked as "Favorites". If there are no such tabs, the side menu will be empty. On the user's first authorization the panel will also be empty. For "Favorites" tabs to appear in the menu, they must be marked in the main menu.

2. Button to open the main menu section The button opens the main side menu with all program tabs. This is where you navigate to all required sections; for convenience all functions are grouped by category.

3. Tab navigation buttons Used to move across tabs, right and left respectively, if all active tabs do not fit in the tab area displayed by the user's browser.

4. Tab area Used for quick switching between active sections. The active tab is highlighted on the panel with a different color.

5. Button to open the notifications section The button opens information about warnings, errors, and system information that occur during work. This section is needed for quick diagnostics of the program and to simplify user support.

6. Button to open the user profile The button opens information about the user working with the program, and also allows selecting a department, a period, and a theme.

7. Button to open program information The button shows the program version and the developer.


#### Main menu, bookmarks (quick access) panel


![Main menu, bookmarks (quick access) panel](images/p041-01.jpg)

![Main menu, bookmarks (quick access) panel](images/p041-02.jpg)

The main menu visually
is a tree of catalogs.

A catalog expands when you click its
name. If the catalog contains nested
catalogs, expansion continues
until a leaf
page is reached. A page is also
selected by clicking its name.
A catalog has a "Folder" icon; when
the catalog is expanded the icon changes
to "expanded", and the arrow
to the left of the icon
changes direction and points down.
When the catalog contents are hidden,
the icon changes from "expanded" to
"hidden", and the arrow points right.


To add pages to the
"Favorites" quick access panel
hover the cursor over the
page; a "star" icon will appear
on the left. Click this icon.
The "star" will be highlighted and will
remain displayed next to
the page name in the main menu.
To remove the icon, click

it again. When the icon is removed,
the page will be deleted from the
"Favorites" panel


When pages are added to the
"Favorites" quick access panel,
pages are displayed not
as a hierarchy but as a list. The order
of items in the list will change as
items are added depending on the main hierarchy
of pages by catalogs.


To delete pages from the
"Favorites" quick access panel
hover the mouse cursor over
the page graphic icon to the left of
the name; the icon will change to
a "cross"; click it, and the page
will be deleted.


#### Notification panel

To view system
information, open the
"Notifications" menu.

It contains information for
developers, the system
administrator, and technical
support. Here you can
switch between tabs and notification
types.

Information is distributed across blocks:

All - all received messages regardless of type and notifications from the DB;
Information - informational messages (type info);
Errors - error messages (type error);
Warnings - warnings that require user confirmation (type warning);
Notifications - messages received from the notification service;
Development - debug messages and the list of global variables for each open page.


#### User profile






![User profile](images/p042-01.jpg)

![User profile](images/p042-02.jpg)

![User profile](images/p042-03.jpg)

![User profile](images/p042-04.jpg)

![User profile](images/p042-05.jpg)

![User profile](images/p042-06.jpg)

To view information about
the user authorized in the system
open the
user profile. Here you can
also change the interface theme.


#### About the program

Version and build
information is displayed in a
popup window after clicking the
"About the program" button.


### Workspace

The workspace consists of pages that contain filters, related tables with tabs, and
control panels.

The workspace look differs in the light and dark themes.

The relationship between tables follows the "Accordion" principle — when an item is selected in the upper table (data block),
information for the selected record is displayed in the lower table (data block); if there are several tables, you must
select records in each table (data block) sequentially from top to bottom. If a record in the upper table
is not selected, the control panels on the lower table will be inactive.


### Controls and their notation


![Controls and their notation](images/p043-01.jpg)

![Controls and their notation](images/p043-02.jpg)

![Controls and their notation](images/p043-03.jpg)

![Controls and their notation](images/p043-04.jpg)

The main controls are shown for each block that actions are performed on and are
standard. Elements are also grouped by blocks. Placement in the Dark theme is vertical, in the Light theme —
horizontal. In the Light theme some functional buttons are labeled; in the Dark theme intuitive
icons are used, so to clarify a button's purpose hover the cursor over it; a tooltip with
the button name will appear.

Global filters are always located at the top of the page workspace.

Table 1 – Control panel for filter blocks

Active element Inactive element Descrip Active element Inactive element
tion
of the
element

Button
colle
ctor
(the

"more"
button).
The
elem
ent
is
inten
ded
to
hide
filt
er
func
tion
al
butt
ons.
To
disp
lay
all
filter
capa
bili
ties,
you
need
to
click
the
elem
ent,
after
which
a list
of
hidde
n
filte
ring
func
tions
will
expand;
select
the
needed
one.

- Hide -
/expa
nd
filt
ers.
Inten
ded
to
show
/hide
the
filte
ring
panel.
Hidi
ng
/expa
nding
the
panel
does
not
affect
the
data
ente
red
in
the
filter.

- Search. -
The
key

elem
ent
for
filt
er
pane
ls;
info
rma
tion
for
the
selec
ted
filt
er
is
not
disp
layed
until
search
is
click
ed

- Clear -
filt
er.
For
quick
reset
of
all
set
filter
para
met
ers

Select.
The
elem
ent
is
pres
ent
in
neste
d and
comp
ound
filt
ers. It
selec
ts
a
recor
d
from
a
table
with
filte
red
info
rma
tion

- Cancel. -
The
elem
ent
is
pres
ent
in
neste
d and
comp
ound
filt
ers.
It
canc
els

selec
tion
of a
recor
d
from
a
table
with
filte
red
info
rma
tion

Light theme Dark theme


Table 2 – Control panel for data blocks

Active element Inactive element Description Active element Inacti
of the element ve element

Button
collector (the
"more" button). The
element is intended
to hide
functional
buttons that
do not need to
be used
often. To select
a button hidden
in the collector,
click the
element, after
which a list of hidden
buttons will expand;
select
the needed one.

Button
collector for
periods. The
element
is intended to
hide
the summary of
procedures
for closing
/opening
settlement
periods.

Add.
Element for
adding
data in
the selected block

- Edit. El -
ement for
editing
data in
the selected block

- Clone. Elem -
ent intended
to add
new data
by
copying
existing
data

Delete. Element
for deleting

data in
the selected block


Information. Disp
lays
information about
the last
change of the record
— the date and
the system
user

Refresh.
Sends a request
to update
records in the
database

Call fill
wizard. Pres
ent not on all
forms,
used for
bulk
operations.
Functions will
be described when
describing
specific forms.

Export (print)
to Excel. Expo
rts
the view
or the table formed
in the workspace
in
Excel
document format. For
each table
(data block)
a separate
element of this
type is used.

Light theme Dark theme


For convenient presentation and work, data can be split by tabs, pages, logical groups, have
navigation through change history, and sorting by columns.

Table 3 – Information presentation panels

Light theme Description Dark theme
of the
element

Tabs.
All
record
data
is
group
ed by
certai
n
indic
ators. For
conve
nient
displ
ay,

exhau
stive
infor
mation
is
shown
by
groups
on
tabs

Paginator.
If
all
data
does
not
fit
in
the
works
pace,
data
is
split
into
pages;
navig
ation
betwe
en
pages
is
done
by
flippi
ng
pages
with
pagin
ator
buttons
("<" -
go to
the
previ
ous
page,
">" -
go to
the
next
page,
"<<" -
go to
the
first
page,
">>" -
go to
the
last
page).
This
also
shows
the
numb
er of
pages
and
the
curren
t
positi
on.

History. V
iew
histori
cal
data

for a
record
(if
avail
able)


Sortin
g. To
sort
by
the
requir
ed
colum
n,
click
the
colum
n
heade
r
(ascen
ding
"a-z" –
arrow
up,
descen
ding
"z-a" -
arrow
down). If
there
is no
arrow,
sortin
g
is
done
by
defaul
t (date
added).
The
colum
n
by
which
sortin
g
was
perfor
med
is
highli
ghted
in a
differ
ent
color,
and
an
arrow
is
shown
next
to
the
name

Groupi
ngs. Used
for
conve
nient
displ
ay of
infor
mation
when

logical
groups
of
infor
mation
fields
are
presen
t. By
defaul
t all
panels
are
expan
ded;
they
can
be
collap
sed
by
clickin
g the
group
name.
Expan
ding
works
the
same
way


For convenient work, records in grids also have controls. This allows error-free
editing, viewing of child records, and quick navigation to related data on other pages. Such
elements are always placed on the left in the first column, directly next to each record.

Table 4 – Controls for records

Light theme Element description Dark theme

Hierarchy. Show/hide hierarchy or additional data. If the
record has a list of additional information or child
records that can be viewed, expand/collapse the list by clicking
this element (">" icon - list is hidden, "V" icon - list is expanded)

Editing. To make changes to the selected record


Related data. For quick navigation to forms with related data


### Data input elements


![Data input elements](images/p050-01.jpg)

![Data input elements](images/p050-02.jpg)

All data input elements are standard.

Elements can be required or optional.

Required elements are marked with a red asterisk. The required flag
applies to data input elements of any type.

Optional fields can be filled in when information is available or as it arrives.

Elements can also be inactive; then they will be highlighted in a different color and blocked for input.

Table 1 – Data input elements

Light theme Description Dark theme
of the
element

Required
field
flag

Filter
field. To
enter
data into such
fields,
click the
magnifying glass icon and
select a record
from
the dropdown
filter

Simple field. T
he field
is used
to enter text
or numeric
information.

Date field. The
field
is used
to enter a date in
a given
format
(for example, DD.
MM.YYYY) or from
the dropdown
calendar by
clicking the
icon.

Dropdown
list. Contai
ns a defined
list of data
from which
one item must be
selected. In
the dropdown
list you can
search by
the name
of a record in
the list. The field
can be
required

Checkbox.
An attribute
that performs
the logical
function "yes
/no", according to
the label

Quick
navigation field. Such
fields allow
quick
navigation to

another
page with
automatic
insertion
of the data already
in the field

Hint. Locat
ed
directly
in the field to
be filled in.
When the
cursor is hovered
over the
hint
icon,
information about
the filling
rules
for this field appears


### Data input windows


![Data input windows](images/p052-01.jpg)

![Data input windows](images/p052-02.jpg)

Data entry and editing for tables is done with popup modal windows in the center of the workspace,
and for field groups — over the fill-in fields. The filling principle of such windows is the same: enter the information
and click "Save". The "Save" button may be in the lower right or upper left corner.


### Data input wizard (hourglass)



![Data input wizard (hourglass)](images/p053-01.jpg)

![Data input wizard (hourglass)](images/p053-02.jpg)

![Data input wizard (hourglass)](images/p053-03.jpg)

In some cases, entering information requires several similar actions. To optimize
such processes, multiple selection from the data input wizard is used.

The data input wizard contains two windows: available records are shown on the left, selected
records on the right. To add records, select a record and move it to the right window with the single transfer button ">".
Deselection is done the same way by clicking "<". If needed, you can select
all available records with ">>" or deselect all records with "<<". After selecting the required records, close the window
with the "Close" button. The selected records will be added to the corresponding block.

The advantage of this approach is convenient presentation and adding of information. Also, a record cannot
be selected twice, which excludes duplication or overlapping of data.


## Constructor components

![Constructor components](images/p054-01.jpg)

This catalog contains articles describing all objects and the main settings of their attributes


### Grids

Objects of classes Button or Button Collector (Button/Collector) with
cn_order < 1 000 000 will be displayed before the default button block. Simple grid (Grid)
"Tree" grid (Grid
Components for displaying data as tables. Tree)


Main settings for all grid types
May contain the following object types:

Buttons, button-columns, button collectors;
Filter;
Columns (numeric, string, with dates, etc.);
Detail fields;
Navigations to another page;
Windows.


Buttons with main actions are exposed as grid attributes and by default have the value "true":


1. btndelete – the "Delete" button;
2. btnaudit – the "Information" button;
3. btnexcel – the "Export to Excel" button;
4. btnrefresh – the "Refresh" button.

For all static buttons the sort order (cn_order) = 1 000 000.

Objects of classes Button or Button Collector (Button/Collector) with cn_order < 1 000 000 will
be displayed before the default button block.

Objects of classes Button or Button Collector (Button/Collector) with cn_order > 1 000 000 will
be displayed after the default button block.


Data sorting in a grid is configured with attributes:

orderproperty – name of the parameter from the service by which the grid will be sorted;
orderdirection – sort direction (ASC/DESC).


Working with grid values is configured with attributes:

Name Description

of the
attribute

collectionvalues Type of value collection:
object - as an object;
array - array of strings.

selmode Ability to select multiple values in GRID and TREEGRID

SINGLE - only 1 value

SIMPLE - allows selecting values one after another. Each click adds/removes
a value.

MULTI - allows complex selection of values, taking ctrl and shift into account


The splitter display is configured with the spliter attribute.


#### Simple grid (Grid)


![Simple grid (Grid)](images/p056-01.jpg)

![Simple grid (Grid)](images/p056-02.jpg)

![Simple grid (Grid)](images/p057-01.jpg)

A table that displays data in rows and columns.


Settings

Main settings for all grid types can be viewed here.


The add/edit mode of data in the grid is determined by the edittype attribute and can take values:

inline – in the row;


modalwindow – in a modal window.

When the inline edit type is specified, grid columns are transformed into fields according to the Table:

Grid column Field on add/edit

Column Boolean Field Checkbox

Column Date Field Date

Column Integer Field Integer

Column Numeric Field Numeric

Column String Field Text


If, based on a String class column, you need not a text field (Field
Text) in modification mode, but, for example, a "Dropdown list" field (Field Combobox):

1. select the required grid column;
2. create a child object of class Combobox;
3. configure it correctly (specify the correct column, displayfield, idproperty, valuefield, service)
4. specify the required add/edit mode in the Combobox field's editmode attribute. Possible values: all - available in all modes;

```
       insert - data entry is possible only on add;
       update - only editing is possible;
       disabled - unavailable for data entry.

When the value disabled is specified, the field will not be displayed in the modal window.
If the field still needs to be displayed in the modal window but unavailable for entry/editing,
specify the value "true" in the visibleinwindow attribute on the column.
```

5. The field name in the auto-assembled window will be taken from the column name.

When the modalwindow edit type is specified and there is no Window class object in the grid, an auto-assembled
window will be formed based on the grid columns (details here).


The number specified in the pagesize attribute affects the number of grid rows displayed on one page.

The grid will also render a paginator showing which page of the total is currently displayed.


#### "Tree" grid (Grid Tree)

Data displayed as a hierarchical table.


"Tree" grids have no pagination and no column filters.

For correct display, a Grid Tree must contain a column of class – "Tree" column (Column Tree). This
column must contain data about first-level parent objects to build the correct hierarchy.


Settings

Main settings for all grid types can be viewed here.


The rootvisible attribute enables (true) / disables (false) display of the grid root element.


Service specifics

For correct display of the hierarchical structure of a "Tree" grid, the service result set must contain
the following key-values:

Key name Comments

ck_id Unique record identifier

ck_parent Unique identifier of the parent node.

Empty for the root node.

leaf Whether the node is a leaf.

true - if the node is a leaf;

false - if the node is a root.


### Buttons (Button)


![Buttons (Button)](images/p058-01.jpg)

![Buttons (Button)](images/p059-01.jpg)

If a grid contains several windows, the paired
attribute ckwindow allows linking a specific button to a specific window. To configure the link, specify the same ckwindow value on both the window and the button.


If user confirmation is required to perform the action after clicking the button, the confirmation
question is specified in the confirmquestion attribute.


The operation performed by the button is configured with attributes:

handler - which handler to use.

Possible values:

Name Description

onCreateChildWindowMaster opens a window (Window) when adding a record in a grid with
attribute edittype = modalwindow

onRowCreateChildWindowMaster opens a window (Window) when editing a record in a grid
with attribute edittype = modalwindow

onSimpleSaveWindow saving data by button for a modal window

onCloseWindow closing a modal window.
After clicking the button a confirmation
message is displayed: "Cancel? Yes/No"

onCloseWindowSilent closing a modal window without a message

onPrintHandleOnline Online print

onPrintHandleOffline Deferred print

mode - Type of operation invoked by the button

Possible values:


Name Description

1 Add

2 Edit

3 Delete

4 Call the service from the updatequery attribute

5 Call the information menu

6 Value cloning mode

7 File export mode

8 File upload mode


modeaction - The action value passed in json instead of the standard I,U,D
updatequery - Service name for custom operations
filetypes - Document type available for selection in method 8
maxfile - Maximum file size in bytes


Button icon is configured with attributes:

iconfont - Icon (for example, fa-plus)

iconfontname - Class name or column name when dynamic

onlyicon - Only the button icon is displayed (true/false)


tipmsg - Tooltip on the button on hover


uitype - button look (1-primary, 2-secondary)

Light theme uitype Dark theme

1


2


Button display on initialization is configured with attributes:

disabled - button inactive flag

disabledemptymaster - button inactive flag when the master is empty
hidden - button hidden flag


Hyperlink navigation is configured with the columnsfilter and redirecturl attributes. Details here


#### Button Collector

Allows collecting several buttons into one component.


When the btncollectorall attribute is set to "true", the Button Collector will automatically include the Information and
Export to Excel buttons.


### Columns

They are a composite part of grids (simple, grid-tree, "Dropdown table" field). Objects of class Column Action Icon
(Button-column with icon) can be standalone and have no parent.


#### "Boolean" column (Column Boolean)


![Boolean column (Column Boolean)](images/p062-01.jpg)


!["Flag" column (Column Checkbox)](images/p063-01.jpg)

Main column settings
To display data in columns (except button-columns), specify the key name from the query in the column attribute.


Text placement in a column is configured with the align attribute with available values:

left - left;
center - center;
right - right

Default values are set with the defaultvalue and defaultvaluequery attributes.

The defaultvalue attribute specifies a static value. Examples:

true/false - for checkbox;
1/0 - for boolean;
sysdate - to specify the current date/time in ISO 8601 format in Column Date.

The defaultvaluequery attribute specifies the name of a service whose returned value will be the default
value for the column.


The editmode attribute affects whether data can be entered in the column in add/edit mode and can take
values:

all - available in all modes;

```
insert - data entry is possible only on add;
update - only editing is possible;
disabled - unavailable for data entry.
```

The maximum number of characters in a column is set with the maxsize attribute.


The regexp attribute specifies a regular expression to validate the entered value.


Whether a column is required is controlled by the required attribute (true/false).


To sort data in a column by a value other than the column attribute, specify the required key from the service in
the sortcolumn attribute.

Usage example:


Column visibility in the grid can be configured using the visible attribute (true/false).


Column width is specified as a percentage with an integer from 1 to 100 in the width attribute.


#### "Boolean" column (Column Boolean)

A column for displaying a logical data type (Yes/No).

Can take the value 1 or 0. Cannot be empty.


#### "Date" column (Column Date)

Used to display dates in ISO 8601 format.

The data display format is controlled by the format attribute value.

Possible values:

1 - YYYY;
2 - MMM YYYY;
3 - DD.MM.YYYY;
4 - DD.MM.YYYY HH:00;
5 - DD.MM.YYYY HH:MI;
6 - DD.MM.YYYY HH:MI:SS.


#### Button-columns

A variety of button-columns.

Used to select multiple records in a grid.


##### "Edit" button-column (Column Edit)


A variety of button-column.

Displays an edit button for each record in the grid.


##### "Delete" button-column (Column Delete)


!["Delete" button-column (Column Delete)](images/p064-01.jpg)

!["Delete" button-column (Column Delete)](images/p064-02.jpg)

A variety of Button-column. Used to delete the selected grid record. Displayed directly in the grid
for each record.


##### Button-column for displaying the detail icon (Column Detail)


A variety of button-column.

Used to configure visibility of the detail icon in the grid. For example, if it needs to be hidden for a totals row.


##### Button-column with icon (Column Action Icon)

![Button-column with icon (Column Action Icon)](images/p065-01.jpg)

If a button is needed for each record in the grid, an object of class Button-column with icon (Column
Action Icon) is used.

This object includes all settings of the Button class (link), but is a column in the grid.


Usage examples:

"Update binding" button-column and "Icon" button-column on the Pages page:

To display different icons depending on data, specify the value "true" for the dynamicicon attribute.


#### Text columns

A column for displaying level-1 data in a "Tree" grid.


##### "String" column (Column String)

!["String" column (Column String)](images/p066-01.jpg)

!["String" column (Column String)](images/p066-02.jpg)

A column for displaying text data.

The imask attribute specifies the data input mask.

For example, (999) 999-99-99


Hyperlink navigation is configured with the columnsfilter and redirecturl attributes. Details here


#### Numeric columns

A column for displaying integer values.


The maximum number of characters is specified in the maxsize attribute.


The maximum and minimum column values are specified in the maxvalue and minvalue attributes respectively.

##### "Number" column (Column Numeric)

!["Number" column (Column Numeric)](images/p067-01.jpg)

A column for displaying numeric data.

The currencysign attribute specifies a postfix that will be added to the data. For example, "руб." to display an amount.


The decimalprecision attribute specifies an integer that defines precision after the decimal point.

The decimalseparator attribute - fractional part separator.

The thousandseparator attribute - thousands separator.


> **Important!**
> The values of the thousandseparator and decimalseparator attributes cannot be the same.


If you attempt to override the values of these attributes on an object and/or page in a way that would
make the values the same, the system will return an error: "The values of the decimalseparator and thousandseparator attributes cannot
be the same"


### Window


An object of class Window can include objects of classes:

buttons and button collectors;
panels (containers of type "Panel" and "Box", Dynamic panel);
fields;
grids (simple and grid-tree).

Windows are used to add/edit grid records.


There are 2 types of windows:

1. Custom (a created Window class object that includes fields and buttons);
2. Auto-assembled (created automatically based on grid columns).


#### Auto-assembled window



![Auto-assembled window](images/p068-01.jpg)

![Auto-assembled window](images/p070-01.jpg)

![Auto-assembled window](images/p070-02.jpg)

![Auto-assembled window](images/p070-03.jpg)

Formed automatically when clicking a button in a grid with handler = 'onCreateChildWi Transforming columns
ndowMaster' or handler = 'onRowCreateChildWindowMaster'. Includes fields of the grid into fields in
formed based on grid columns if the grid's edittype specifies the auto-assembled window
value "modalwindow" and one of the following conditions is met: Configuring
the auto-assembled window
there is no Window class object in the grid; Name of
the grid has a Window class object, but the value of the paired auto-assembled window
ckwindow attribute on the window and the button (Button) in the grid does not match.


Transforming grid columns into fields in an auto-assembled window

When forming an auto-assembled window based on grid columns, fields will be formed according to the table:

Grid column Field in the auto-assembled window

Column Boolean Field Checkbox

Column Date Field Date

Column Integer Field Integer

Column Numeric Field Numeric

Column String Field Text


Configuring an auto-assembled window

If, based on a String class column, you need not a text field (Field
Text) in the auto-assembled window, but, for example, a "Dropdown list" field (Field Combobox):

1. select the required grid column;
2. create a child object of class Combobox;
3. configure it correctly (specify the correct column, displayfield, idproperty, valuefield, service)
4. specify the required add/edit mode in the Combobox field's editmode attribute. Possible values: all - available in all modes;

```
       insert - data entry is possible only on add;
       update - only editing is possible;
       disabled - unavailable for data entry.

When the value disabled is specified, the field will not be displayed in the modal window.
If the field still needs to be displayed in the modal window but unavailable for entry
/editing, specify the value "true" in the visibleinwindow attribute on the column.
```

5. The field name in the auto-assembled window will be taken from the column name.


Name of an auto-assembled window

The modal window name is formed according to the modification type of the button that opens it (the
mode attribute is analyzed: 1 - add/ 2 - edit/ 6 - clone) and the "Object description"
field of the corresponding parent object (grid, grid-tree, Panel History).

Example:

1. Grid description - "Contracts"


2. mode attribute value = 1 for the button that opens the auto-assembled window


3. Auto-assembled window name: "Adding Contracts"


#### Custom window



![Custom window](images/p072-01.jpg)

![Custom window](images/p072-02.jpg)

![Custom window](images/p072-03.jpg)

If complex logic is needed when adding/editing data in
a grid (for example, hiding fields in certain cases), a custom Settings
window must be formed. Name of
a custom window
In a Window class object, the required fields and buttons are created. Method 1
Method 2


Settings

The ckwindow attribute is used to link a window and the button that opens it. The value of this attribute for the button
and the window must match.


To display the "Add more" checkbox in the window, set the checkaddmore attribute to true.


Window size is configured with the following attributes:

Attribute name Description

height Static height in pixels (px)

maxheight Maximum height

minheight Minimum height

wintype Window type (affects window width):
narrow: 500px, default: 800px, wide: 1000px, xwide: 1200px, xlwide: 1600px


Name of a custom window

Method 1

If a custom window (Window) has the "Displayed name" field filled in, the modal window name matches
the value of this field.

This method should be used when the window is used only for one operation type (for example, only
adding data).

Example:

Window "Clone Object Window" in grid "SYS Grid Object << DO NOT CHANGE":

Method 2

If the "Displayed name" field is not filled in, the name is formed as follows: button modification type
+ the value of the "Object description" field of the window (Window).

This naming method is used when one modal window is opened for different modifications
(for example, Add and edit).

Example:

Window "Add/Edit Object Window" in grid "SYS Grid Object << DO NOT CHANGE":


### Panels

"Container" type components for including other elements.


#### Dynamic Panel


![Dynamic Panel](images/p073-01.jpg)

![Dynamic Panel](images/p073-02.jpg)

A container that displays elements returned from the backend.

This component is implemented to render:

on one page a grid with a different set of columns (count/name, etc.).
in one modal window a different set of fields.

A Dynamic Panel will have a standard header of the form:


{
"cl_dataset": "1",
"cv_name": "Dynamic Panel",
"ck_page": "' || to_char(pk_page) || '", -- .
"ck_modify": "modify",
"cv_helper_color": "red",
"contentview": "vbox",
"reqsel": "true",
"type": "FIELDSET",
"datatype": "array",
"column":"_",
"childs": [';
{ }

']}';


--


Lifehack

To form correct JSON you can:

1. on a test page, draw the object that you want to return from the backend.
2. open the page with the drawn object.
3. copy the JSON structure of the required object from the GetMetamodelPage service


Example

We have a multi-tariff electricity meter. The number of tariffs is obtained as a meter attribute from the DB. The task is to create
an input form for readings for such meters.

Create a procedure whose result will be JSON describing our input form.


--
vc_json := '{
"cl_dataset": "1",
"cv_name": "Dynamic Panel",
"ck_page": "' || to_char(pk_page) || '", -- .
"ck_modify": "modify",
"cv_helper_color": "red",
"contentview": "vbox",

"reqsel": "true",
"type": "FIELDSET",
"datatype": "array",
"column":"ca_value",
"childs": [';

-- child ( )
--
for vcur_child in (select rownum as cn_cnt,
i.ck_id,
s.cv_short,
s.cr_indication,
case i.cn_value
when null then
''
else
trim(to_char(i.cn_value, rpad(lpad
('D', vn_capacity_int
+1,'9'),

vn_capacity_int + vn_capacity_dec + 1,
'9'),

'NLS_NUMERIC_CHARACTERS = ''.,'''))
end as cv_value,
i.cl_overstep,
decode(nvl(i.cl_overstep, 0), 0,
'"checked":"0",', '"defaultvalue":"1",') cl_overstep_bool
from t_indication i
left join t_d_service s
on s.ck_id = i.ck_d_service
where i.cn_key_group = pn_key_group) loop
-- EDIT CHECKBOX 0 .
if vcur_child.cn_cnt > 1 then
vc_json := vc_json || ',';
end if;
vc_json := vc_json || '{
"cl_dataset": "1",
"cv_name": "Dynamic Panel",
"ck_page": "' || to_char(pk_page) || '",
"ck_modify": "modify",
"cv_helper_color": "red",
"contentview": "column",
"reqsel": "true",
"type": "FIELDSET",
"datatype": "array",
"column": "' || to_char(vcur_child.ck_id) || '",
"childs": [{
"cl_dataset": "0",
"cv_name": "cn_value_' || to_char(vcur_child.cn_cnt) || '",
"column": "cn_value",
"cv_displayed": "/ ' || vcur_child.cv_short || '", --
"ck_page": "' || pk_page || '",

"width": "60%", -- %
"datatype": "numeric", --
"decimalprecision": "' || to_char(vn_capacity_dec) || '",
--
"thousandseparator": " ", --
"maxvalue": "' || vv_maxvalue || '", --
"defaultvalue":"' || to_char(vcur_child.cv_value) || '", --
,


"info": null,
"required": "true",
"type": "IFIELD",
"visibileinwindow": "false"
},
{ "cl_dataset": "0",
"cv_displayed": " \"\"",
"cv_description": " \"\"",
"ck_page": "' || to_char(pk_page) || '",
"column": "cl_overstep",
"fieldlabel": "&nbsp;",
"width": "40%",
"datatype": "CHECKBOX",' || to_char(vcur_child.
cl_overstep_bool) ||
'"type": "IFIELD",
"visibileinwindow": "false"}]}';
end loop;
vc_json := vc_json || ']}';


In the end the backend should return JSON of the form:


{
"success": true,
"data": [
{
"cl_dataset": "1",
"cv_name": "Dynamic Panel",
"ck_page": "301",
"ck_modify": "modify",
"cv_helper_color": "red",
"contentview": "vbox",
"reqsel": "true",
"type": "FIELDSET",
"datatype": "array",
"column": "ca_value",
"childs": [
{
"cl_dataset": "1",
"cv_name": "Dynamic Panel",
"ck_page": "301",

"ck_modify": "modify",
"cv_helper_color": "red",
"contentview": "column",
"reqsel": "true",
"type": "FIELDSET",
"datatype": "array",
"column": "13",
"childs": [
{

"cl_dataset": "0",
"cv_name":
"cn_value_1",
"column":
"cn_value",

"cv_displayed": "/ ",
"ck_page":
"301",
"width":
"60%",
"datatype":
"numeric",

"decimalprecision": "9",

"thousandseparator": " ",
"maxvalue":
"99999.999999999",

"defaultvalue": "",
"info": null,
"required":
"true",
"type":
"IFIELD",

"visibileinwindow": "false"
},
{

"cl_dataset": "0",

"cv_displayed": " \"\"",

"cv_description": " \"\"",
"ck_page":
"301",
"column":
"cl_overstep",

"fieldlabel": "&nbsp;",
"width":

"40%",
"datatype":
"checkbox",
"checked":
"0",
"type":
"IFIELD",

"visibileinwindow": "false"
}
]
}
]
}
],
"metaData": {
"responseTime": 0.029,
"total": 1
}
}


After processing in the middle layer, such JSON will turn into this input form


#### Container of type "Box"

A lightweight version of a container of type "Panel".

Used to group fields into data blocks.


#### Container of type "Panel"

![Container of type "Panel"](images/p078-01.jpg)

![Container of type "Panel"](images/p078-02.jpg)

The component is a container in which almost any objects can be placed:

Buttons and Button Collectors;
Filters;
Grids (simple and grid-trees);
Fields (text, numeric, etc.);
Panels (Tab panels, Panel History, containers of type "Panel", etc.).

This component is used to aggregate information from several types of Constructor objects.


The collapsed attribute determines whether the panel is collapsed on page initialization (true - collapsed).

The collapsible attribute indicates whether the panel can be collapsed (true/false).

Example:


The "Status" panel is expanded, the others are collapsed.


You can block editing of the panel's child objects with the editmodepanel attribute (Works when
the panel contains fields/panels with fields and buttons (buttons contained in the panel will be hidden). Does not affect
the behavior of grids in panels).


The contentview attribute specifies the panel's content layout.

Possible values:

hbox - horizontal (Objects will be placed horizontally one after another);
hbox-wrap - horizontal with wrap to the next line (If the total width of objects exceeds 100%
(overridden width attribute values are summed), objects will wrap to the next line);
vbox - vertical (objects will be placed vertically one under another).

The align attribute determines the placement of the Panel's content.

Available values:

left - Objects are aligned to the left side of the Panel;
right - Objects are aligned to the right side;
center - Objects are aligned to the center.

If no align value is set for the panel, fields stretch across the full width of the container.

If align is set, fields take a defined width in order to group on the left, right, or center.


#### Detail panel in a grid (Panel Detail)


![Detail panel in a grid (Panel Detail)](images/p079-01.jpg)

Allows displaying detail fields for a record in a grid.

The contentview attribute specifies the panel's content layout.

Possible values:

hbox - horizontal (Objects will be placed horizontally one after another);
hbox-wrap - horizontal with wrap to the next line (If the total width of objects exceeds 100%
(overridden width attribute values are summed), objects will wrap to the next line);
vbox - vertical (objects will be placed vertically one under another).


#### File upload and display panel (Panel File)

A component for uploading and displaying uploaded files.

To display file names, the service must return the key-value cv_file_name.

The label is assembled from key-values: cv_dd_name + cv_number + cd_date.

The "Add", "Cancel", "Delete", "Download", and "Add file" buttons are hardcoded in the Panel File class.

For correct user configuration of these buttons, create child objects of class Button in Panel File
with the corresponding object name:

"Cancel" button when adding a file Override Cancel Button

"Add file" button when adding a file Override Save Button

"Delete" button Override Delete Button

"Download" button Override Download Button

"Add" button on the file view panel Override Add Button

Further configuration is done for the Override buttons.


#### Panel with historical data (Panel History)


![Panel with historical data (Panel History)](images/p080-01.jpg)

![Panel with historical data (Panel History)](images/p080-02.jpg)

The component is implemented to display historical data (attributes, details, etc.). It is a panel with
a defined set of fields and a control element.

The control element contains 8 buttons:


1. Add;
2. Edit;
3. Clone;
4. Delete;
5. Previous record;
6. Next record;
7. Information.

For all static buttons the sort order (cn_order) = 1 000 000.

Objects of classes Button or Button Collector (Button/Collector) with cn_order < 1 000 000 will be displayed before
the default button block.

Objects of classes Button or Button Collector (Button/Collector) with cn_order > 1 000 000 will be displayed after
the default button block.


By default, data is displayed for the maximum date. If there are records for previous dates, switching between their
display is done with the navigation buttons (Previous record, Next record).

When creating a new record that differs from the previous one in only a few fields, use the
"Clone" button. In this case all Panel History fields will be filled with values from the previous record except the record date itself (for example,
the start date of a service object passport). The user specifies a new record date, changes the values of the required
fields, and saves the new record. This function avoids manually typing repeating values.


General rules for maintaining historical data

There are 2 ways of maintaining attribute change history:

1. Without an end date (The attribute end date is not maintained by the user; an End date is provided in the DB):

when adding a new record, check that the previous record is closed and we are inserting a new record;
when changing data, check that the new date of the inserted record does not overlap with the previous
interval(s);
for the previous record (both when adding a new record and when editing) set End date =
Start date of the inserted record -1 second;
when deleting the last record (at max(Start date)) set End date = null on the previous record.

2. With an end date (The attribute end date is maintained by the user):

when adding a new record, check that the previous record has an End date filled in and
it is less than the Start date of the inserted record;
when editing/changing, check that we are editing the last record (with max(Start date))
and that the End date of the previous record is less than the Start date of the updated one; add a period of 23 hours 59 minutes 59 seconds
to the End date of the previous record.


Checks on the DB side

Without an end date


/* */
for pcur_max in (select a.cd_st cd_st_max,
a.ck_id ck_id_max,
lead(cd_st) over(order by cd_st desc) cd_st_prev,
lead(ck_id) over(order by cd_st desc) ck_id_prev
from t_org_attribute a
where a.ck_org = pot_org_attribute.ck_org
order by cd_st desc fetch next 1 rows only) loop
vd_st_max := cd_st_max;
vk_id_max := ck_id_max;
vd_st_prev := cd_st_prev;
vk_id_prev := ck_id_prev;
--
if vd_st_max >= pot_org_attribute.cd_st and pv_action = pkg.I then

```
pkg.p_set_error(1131); /*        */
end if;
if pot_org_attribute.ck_id != vk_id_max and pv_action = pkg.U then
pkg.p_set_error(1132); /*    */
end if;
if vd_st_prev >= pot_org_attribute.cd_st and pot_org_attribute.ck_id =
vk_id_max and pv_action = pkg.U then
pkg.p_set_error(1133); /*           */
end if;
end loop;
if pv_action = pkg.I and vv_error is null then
/* "    " */
pot_org_attribute.ck_id := seq_org_attribute.nextval;
insert into t_org_attribute values pot_org_attribute;
--
update t_org_attribute a set cd_en=pot_org_attribute.cd_st-interval '1'
second where ck_id = vk_id_max;
elsif pv_action = pkg.U and vv_error is null then
/* "    " */
update t_org_attribute
set row = pot_org_attribute
where ck_id = pot_org_attribute.ck_id;
--
update t_org_attribute a set cd_en=pot_org_attribute.cd_st-interval '1'
second where ck_id = vk_id_prev;
if sql%notfound then
pkg.p_set_error(504);
end if;
end if;
```

With an end date

/* , */
for pcur_max in (select a.cd_en cd_en_max,
a.ck_id ck_id_max,
lead(cd_en) over(order by cd_st desc) cd_en_prev
from t_org_attribute a
where a.ck_org = pot_org_attribute.ck_org
order by cd_st desc fetch next 1 rows only) loop
vd_en_max:= cd_en_max;
vk_id_max:= ck_id_max;
vd_en_prev:= cd_en_prev;
--
if vd_en_max is null and pv_action = pkg.I then

```
pkg.p_set_error(1134); /*         */
end if;
if vd_en_max >= pot_org_attribute.cd_st and pv_action = pkg.I then
pkg.p_set_error(1135); /*       ,     */
end if;
if pot_org_attribute.ck_id != vk_id_max and pv_action = pkg.U then
pkg.p_set_error(1132); /*    */
end if;
if vd_en_prev >= pot_org_attribute.cd_st and pot_org_attribute.ck_id =
vk_id_max and pv_action = pkg.U then
pkg.p_set_error(1136); /*       ,     */
end if;
end loop;
if pot_org_attribute.cd_en is not null then
pot_org_attribute.cd_en:=trunc(pot_org_attribute.cd_en,'DD')+to_dsinterval
('0 23:59:59');
end if;
```


#### Tab Panel

![Tab Panel](images/p084-01.jpg)

The Tab Panel component is implemented to display several tabs with data on one page.


A Tab Panel can include the following object types:

Grids (Simple grid, Grid Tree);
Container of type "Panel";
Panel with historical data (Panel History);
Tab Panel.

When an object is added to a Tab Panel, it will be displayed in a new tab with a name matching the
"Displayed name" field of the added object.

If several objects need to be placed on one tab, a container of type
"Panel" is created in the Tab Panel, and the required objects are then created in it.


Tab Panel tab display is configured with attributes:

Attribute Available values Comment

align left - left; Tab placement

center - top center;

right - right

contentview hbox - horizontally; Text direction in tab
names
vbox - vertically


Example

align = left, contentview = hbox


align = right, contentview = vbox


#### Filter Panel

![Filter Panel](images/p085-01.jpg)

![Filter Panel](images/p085-02.jpg)

A panel with fields by which filtering will be performed.


When the dynamicfilter attribute is true, "dynamic mode" of the filter panel is enabled: when data is entered in any
filter field, the grid is automatically reloaded.


In addition, the filter control panel is removed:

and the Filter looks as follows:


By default, data used for the last search is saved in the cache. I.e., when a closed
page with a filter is opened again, previously entered values will be set in the filter fields.

Saving of filters can be disabled with the filtervaluessave = false attribute.


#### Panel with steps (Panel Road Map)


![Panel with steps (Panel Road Map)](images/p086-01.jpg)

A component for implementing forms with step-by-step filling.


To create a step in PRM, create a child object of class Panel. Place the step content in this object.
For example, a Grid, input/display fields, another panel, etc.

PRM can also contain objects of class Button to override static buttons:

"Override Back Button" - for the "Back" button;
"Override Cancel Button" - for the "Cancel" button;
"Override Next Button" - for the "Next" button;
"Override Save Button" - for the "Save" button.


Buttons can be overridden both in the PRM itself and in child panels.

If objects are overridden in a child panel, the override rules apply only to it. If
the override is done at the PRM level, the rules apply to the corresponding objects of all PRM child panels.


Fields in PRM child panels will immediately be displayed in edit mode.

Buttons placed in child panels with input fields will not be displayed.


For each step in PRM, global variables are set:

"gIsEnd" - flag that the panel is the last of the available ones;
"gIsStart" - flag that the panel is the first of the available ones;
"gPageNum" - displayed step number;
"gPageIndex" - step index (numbering starts from 0).

To use these global variables, add them to the list of global variables on the page
(CORE GUI Constructor Pages).


> **Note!**
> For correct work with these global variables, their names must be specified correctly:


"gIsEnd" - flag that the panel is the last of the available ones;
"gIsStart" - flag that the panel is the first of the available ones;
"gPageNum" - displayed step number;
"gPageIndex" - step index (numbering starts from 0).


For isolation, the ck_id of the Panel Road Map class object on the page (from t_page_object) is appended to the global variable name.


Example

gIsEndF76E1A6689114274Aff0D956C4B90561: false
gIsStartF76E1A6689114274Aff0D956C4B90561: true
gPageNumF76E1A6689114274Aff0D956C4B90561: 1
gPageIndexF76E1A6689114274Aff0D956C4B90561: 0


### Fields

Child elements for containers, windows, and some column types.


#### Embedded frame (IFrame)

Main field settings
To display data in fields (except group fields: Field Set and Field Group), specify the
key name from the query in the column attribute. For a "Period" field (Field Period Date), the columnstart and columnend attributes are used to
set the start and end of the period.


Default values are set with the defaultvalue and defaultvaluequery attributes.

The defaultvalue attribute specifies a static value. Examples:

true/false - for checkbox;
1/0 - for boolean;
sysdate - to specify the current date/time in ISO 8601 format in Column Date;
##first## - to select the first record (Field Grid, Field Combobox);
##alwaysfirst## - to always select the first record (Field Grid, Field Combobox).

The defaultvaluequery attribute specifies the name of a service whose returned value will be the default
value for the field.


The editmode attribute affects whether data can be entered in the field in add/edit mode and can take
values:

all - available in all modes;

```
insert - data entry is possible only on add;
update - only editing is possible;
disabled - unavailable for data entry.
```

The info attribute is used to add extra information about the field. If this attribute has a value, a "?" icon
will be displayed on the field.

When the mouse cursor is hovered over this icon, the value of the info attribute will be displayed.


The maximum number of characters in a field is set with the maxsize attribute.


The regexp attribute specifies a regular expression to validate the entered value.


Whether a field is required is controlled by the required attribute (true/false).


#### Embedded frame (IFrame)

A field for displaying third-party resources by URL or HTML.

Field size is configured with attributes:

Attribute name Description

height Static height in pixels (px)

width Field width. An integer from 1% to 100%. The % must be added.


The format of the value returned by the service is specified in the typeiframe attribute. Possible values: "URL" and "HTML".


For correct content display:

1. create an object of class Iframe
2. bind a service that will return either a URL or HTML of the content
3. in the column attribute for the object, specify the name of the service parameter in which the URL/HTML is returned
4. in the typeiframe attribute, specify the type of the value returned by the service
5. if needed, specify height and width.


#### Group fields

Components for visual (Field Group) or logical (Field Set) grouping of fields into one group.

##### Field Group

![Field Group](images/p088-01.jpg)

A component for combining several fields into one group.

Allows configuring the behavior of the entire group.

Component visualization is configured with attributes:

Attribute name Description

contentview Content layout:
hbox: horizontal
hbox-wrap: horizontal with wrap to the next
line
vbox: vertical

width Field width. An integer from 1% to 100%. The %
must be added.


Locking/hiding of the group is configured with the standard field attributes disabled/hidden respectively.

Lock/hide rules are specified in the disabledrules/hiddenrules attributes.


Attributes that control required-field rules in the group:

Attribute name Description

reqcount Number of required fields in the group
needed for correct validation

reqcountrules Rules for changing the number of required
fields in the group. Has priority over reqcount.

Uses conditional operator syntax: condition ? expr
ession1 : expression2

When the number of required fields in the group is specified, a counter of the form "how many
fields are filled / how many need to be filled" is displayed in the upper right corner.


##### Field Set


This component allows combining several fields into one array, and also repeating this array n times.

A clear usage example is Dynamic Panel


#### "Dropdown table" field (Field Grid)

!["Dropdown table" field (Field Grid)](images/p089-01.jpg)

Allows selecting one value from a grid in a field.


Main settings

May contain:

columns;

detail panel;
filter.


Data sorting in the grid is configured with attributes:

orderproperty – name of the parameter from the service by which the grid will be sorted;
orderdirection – sort direction (ASC/DESC).


For the field to work correctly, specify a service that returns data to the combobox and configure the attributes correctly:

Attribute name Description Comments

column Name of the column in the query from key-value that will
which data is taken be passed to the service

displayfield Name of the parameter that key-value that will
will be displayed be displayed in the interface

idproperty Name of the parameter key-value that contains
responsible for record uniqueness the unique record identifier

valuefield Name of the parameter from key-value from the Field Grid service from
the inner service whose value which the value is taken
will be passed for
further processing


Working with grid values is configured with the attribute:

Attribute name Description

collectionvalues Type of value collection:
object - as an object;
array - array of strings.


Dropdown grid size is configured with attributes:

Attribute name Description

pickerheight Height of the dropdown table/list. Default 390

pickerwidth Width of the dropdown table/list


Configuring multi-select

1. Add a Column Checkbox class object to Field Grid;
2. Bind a service and correctly configure the column, displayvalue, idproperty, valuefield attributes;
3. Set the collectionvalues attribute = array to pass an array of data;
4. If needed, add a Filter Panel.


#### "Dropdown table-tree" field (Field Grid Tree)

!["Dropdown table-tree" field (Field Grid Tree)](images/p091-01.jpg)

Allows selecting a value in a field from a "Tree" type table.


Main settings


> **Important!**
> For the hierarchy to work correctly, it must contain an object of class "Tree" column

May contain:

columns;
detail panel;
filter.


Data sorting in the grid is configured with attributes:

orderproperty – name of the parameter from the service by which the grid will be sorted;
orderdirection – sort direction (ASC/DESC).


For the field to work correctly, specify a service that returns data to the combobox and configure the attributes correctly:

Attribute name Description Comments

column Name of the column in the query from key-value that will
which data is taken be passed to the service

displayfield Name of the parameter that key-value that will
will be displayed be displayed in the interface

idproperty Name of the parameter key-value that contains
responsible for record uniqueness the unique record identifier

valuefield Name of the parameter from key-value from the Field Grid
inner service whose value Tree service from which the value is taken
will be passed for
further processing


Dropdown grid size is configured with attributes:

Attribute name Description

pickerheight Height of the dropdown table/list. Default 390

pickerwidth Width of the dropdown table/list


Service specifics

For correct display of the hierarchical structure of a "Tree" grid, the service result set must contain
the following key-values:

Key name Comments

ck_id Unique record identifier

ck_parent Unique identifier of the parent node.

Empty for the root node.

leaf Whether the node is a leaf.

true - if the node is a leaf;

false - if the node is a root.


#### "Dropdown list" field (Field Combobox)

!["Dropdown list" field (Field Combobox)](images/p092-01.jpg)

This component allows the user to select one value from a list of suggested values or, if needed, enter
a new value.


For the field to work correctly, specify a service that returns data to the combobox and configure the attributes correctly:

Attribute name Description Comments

column Name of the column in the query from key-value that will
which data is taken be passed to the service

idproperty Name of the parameter key-value from the combobox service
responsible for record uniqueness containing the unique record key

displayfield Name of the parameter that key-value from the combobox service
will be displayed that will be displayed in
the interface

valuefield Name of the parameter from key-value from the combobox service
the inner service whose value from which the value is taken
will be passed for
further processing


Example

1. The combobox service returns a selection where:

ck_id - unique record identifier;
cv_name - name

2. After selecting one value from the combobox, the ID of the selected record must be passed to modification with the parameter name ck_parameter
3. Then the Combobox attribute configuration will look as follows:

Attribute name Value Comment

column ck_parameter ID of the selected record passed to Modify

idproperty ck_id ID of the unique record from the list in Combobox

displayfield cv_name Name from the Combobox list

valuefield ck_id Record ID from the list in Combobox


The allownew attribute specifies a prefix-marker for a new value.

Example: the "allownew" attribute value = "NEW:".

When a new value is entered in the combobox, the value "NEW:entered value" will be sent to the server


Filtering of values in a combobox is configured with attributes:

Attribute name Description Comments

minchars Number of entered characters how many characters must be entered
to get hints for combobox value
filtering to work.

querydelay Pause (in sec) before calling the service with
the filter applied

querymode Service call mode: remote or local remote - the service each time
requests values from the DB;

local - the service requests data
once on load and filtering
is done on the loaded set
of values.

queryparam Name of the parameter by which by which key-value from the
combobox service filtering is performed
values are filtered on input.


Pagination of combobox values is configured with the pagesize attribute.


The defaultvalue attribute is used to configure the default value.

To select the first value returned by the service, specify the value ##first##.

To always select the first value, specify the value ##alwaysfirst##


To create small lists in Combobox directly on the frontend, without binding to the backend:

1. create as many child objects of class Record in Combo as there will be values in the lookup. For example, to create a lookup of two values: Yes and No, create 2 child objects of class Record.
2. for each Record, set in the valuefield and displayfield attributes the key and value respectively. For example, valuefield =1, displayfield =Yes
3. in Combo specify the values in attributes: valuefield = valuefield, displayfield =displayfield, idproperty = valuefield


#### "Image" field (Field Image)

A field for displaying images in a modal window (Window) or in a panel (Panel).

Parameters

1. column - points to an attribute in the data object. Must contain a link to an image in the format:


http://... https://...


or an image in base64 format:


data:image/jpeg;base64,...


("data:image/jpeg;base64," must be specified)


> **Note!**
> When specifying a file extension, use MIME-type. For example: image/jpeg, image/svg+xml, etc.


2. height - sets the image height (static height in pixels; px does not need to be specified)
3. width - sets the width of the image container (field width. An integer from 1% to 100%. The % must be added)

Specifics and recommendations

When hovering the mouse over the image, a button that allows downloading the image will appear at the bottom.

By default the image occupies all available height without breaking proportions. When the image is
narrower than the container in width, it is centered. If the image is smaller than the container height, it will be displayed
at original size, without stretching. It is not recommended to specify both height and width at the same time — this may
distort the original proportions.

By default the file name is "Image". To specify a different file name that will be displayed when
downloading, the data object must have a field in the format: {column}_filename, with the name in string format. For example,
for column=cv_image there must be a field cv_image_filename.


#### "Hourglass" field (Field Item Selector)

A field for creating a data selection.

The component is used to create an object of type "Hourglass".


Field height is determined by the height attribute.


The procedure for configuring an object of type "Hourglass" can be viewed here


#### "Flag" field (Field Checkbox)

A field for turning a flag on/off.

If the checkbox is on, the value "1" is sent to the backend; if off — "0".


#### Date fields


![Date fields](images/p095-01.jpg)

![Date fields](images/p095-02.jpg)

Used to display dates in ISO 8601 format.


Main field settings here


Settings

The date format is set with the format attribute.

Possible values:

1 - YYYY;
2 - MMM YYYY;
3 - DD.MM.YYYY;
4 - DD.MM.YYYY HH:00;
5 - DD.MM.YYYY HH:MI;
6 - DD.MM.YYYY HH:MI:SS.


The minvalue / maxvalue attributes can be used to set the minimum / maximum field value.

Static values in quotes (for example, "2019-12-20T00:00:00"), global variables, or conditional
operator syntax (condition ? expression1 : expression2) can be specified


##### "Date" field (Field Date)


A field for displaying dates in ISO 8601 format.


##### "Period" field (Field Period Date)



!["Period" field (Field Period Date)](images/p096-01.jpg)

!["Period" field (Field Period Date)](images/p096-02.jpg)

!["Period" field (Field Period Date)](images/p096-03.jpg)

A double field for displaying a date period in ISO 8601 format.


Main settings

Attribute name Comment

columnstart Parameter name — start of the period

columnend Parameter name — end of the period


Behavioral settings

Configuring behavior attributes to lock/hide an object of class Field Period Date affects the display of both fields
(Start date and end date of the period) of the object.

If you need to configure the behavior of one of the component fields (for example, the period start field):

1. create a child object of class Field Date in the Field Period Date class object;
2. set its column attribute value equal to the columnstart value;
3. configure the required behavior attributes (setglobal, getglobal, etc.) for the child Field Date.


#### Empty Space

A field for reserving space between fields. is not displayed in the interface.

It can be used to configure field placement in containers (Box, Panel, Filter Panel).

Empty Space width is configured with the width attribute.


#### Text fields

Fields for working with text data.


##### "Multiline text" field (Field Textarea)

!["Multiline text" field (Field Textarea)](images/p097-01.jpg)

Main field settings here

##### "Multiline text" field (Field Textarea)


A text field for entering and displaying several lines of text.


You can change the field height in edit mode by dragging the lower right corner of the field

Attributes that allow configuring field height:

minheigth - the height at which fields are displayed on initialization. If this attribute is set, you can increase
the field height, but you cannot make it less than the specified height.
maxheight - the maximum height limit of the field. When this limit is reached, a scroll is enabled.


##### "Password" field (Field Password)


A component for entering and storing passwords and other confidential data.


The "eye" button allows hiding/showing the field data.

##### "Text" field (Field Text)


A field for entering/displaying text data.


Main field settings here


The imask attribute specifies the data input mask.

For example, (999) 999-99-99

##### Advanced text editor (Field WYSIWYG)


##### Hidden field (Field Hidden)


A text field that is not displayed in the interface.


### Menu row "Go to page" (Menu Redirect)

![Menu row "Go to page" (Menu Redirect)](images/p098-01.jpg)

A component to include in the menu opened when navigating to a page.

Used together with the reusable object Menu Redirect Column Icon << Reusable.

columnsfilter - List of fields by which data will be filtered. Enumeration comma-separated without spaces

redirecturl - URL of the page to navigate to


Details on implementing page navigation here


### charts

contentview - affects the placement of the chart and legend on first page load. hbox = hbox-wrap

contentwidth - affects the width of fields in the legend if it is at the top or bottom. Does not affect field width if the legend
is on the left or right.



## Base presentation components

This section contains information on components that allow configuring the base presentation
of the displayed interface.


The base presentation is formed and configured on the "Applications" page (Menu CORE Applications).

This page has no graphical interface and is not displayed in the Menu. Configuration is done by adding
the required objects to this page and overriding their attributes.


### Application

![Application](images/p099-01.jpg)

The main element of the base presentation, to which child elements are added.

The activerules attribute specifies the application prefix value at which this application will
be used when forming the interface.


Example

activerules = cv_url === "sample"

The selected application will be used when specifying a page URL of the form: http://platform address/sample/page
id


Child classes for Application are:

1. Page navigation panel (App Bar Panel)
2. Container for page content (Pages)
3. Window
4. "Drawer panel" window (Window Drawer)


### Containers for page content (Pages and Pager)


![Containers for page content (Pages and Pager)](images/p100-01.jpg)

An element for placing page content.

On creation it automatically includes an object of class Pager (Container for page content).

Only one Pages container should be created for one Application.

If several Pages are created in one Application, the content containers will be placed one after another and will display
page content. However, such a layout affects the correctness of content work.


A Pager container can also be placed in a Window Drawer. Then the expanding panel will display the
page content.

Details here


### Page navigation panel (App Bar Panel)


A panel for displaying:

1. buttons (Button);
2. button groups (Button Group);
3. button collectors (Button Collector);
4. open page tabs (Open Page Tabs).


### Button Group

![Button Group](images/p101-01.jpg)

![Button Group](images/p101-02.jpg)

A class that combines several buttons (Button) to display as a single group in the Navigation panel
(App Bar Panel).

The display order of buttons matches the sort order in Button Group.


Buttons in the group will be separated:

by a vertical line when contentview = hbox:


by a horizontal line when contentview = vbox:


### Open page tabs (Open Page Tabs)

A class for displaying tabs of open pages.


### "Drawer panel" window (Window Drawer)


!["Drawer panel" window (Window Drawer)](images/p102-01.jpg)


![Redirect from outside by session/token](images/p103-01.jpg)

Styling of the window (Window) class as a slide-panel.

May include:

1. containers (Box, Panel, Dynamic panel);
2. container for displaying page content (Pager);
3. list of favorite pages (Favorite Pages);
4. page tree (Pages Tree);
5. notification panel (Notification Tab Panel);
6. theme selection (Theme Combo).


Window placement is set with the align attribute.

Available values:

left - the window will be placed on the left side of the screen;
right - the window will be displayed on the right.

Height and width are set with the height and width attributes respectively.

The top attribute affects the offset from the top of the screen.


A Drawer window is opened by a button located in the Navigation panel (App Bar Panel).

For correct work:

1. specify the same ckwindow attribute values for Window Drawer and the button that opens it;
2. specify Application as the master for the opening button;
3. specify the handler attribute value = onWindowOpen for the opening button.


If a Pager container is placed in a Window drawer, the window will display the content of the page whose Identifier is specified
in the defaultvalue attribute for Pager.

Example:


## Working with constructor components

Purpose

For integration with other projects, seamless navigation to the site is implemented. In this case authorization is not required;
navigation is done with a session or a token passed (see Forming a url for navigation).

Forming a page

The menu with page selection is always open; page content is placed to the right of the menu. The site header with bookmarks,
notifications, theme selection, and information is hidden; the theme is taken from the previously selected variant on the main site.


Forming a url for navigation

Navigation to a page is done in one of two variants:

1. by session
2. by token

When navigating by session, form a url of the following form:


<root-path-to-site>/frame/session/:session_id/:app/:page_id
where:

1. root-path-to-site - data transfer protocol (http\https) + domain name of the site being navigated to,
2. frame/session - route for navigating to a page by session,
3. session_id - user session for authorization,
4. app - name of the Application to navigate to,
5. page_id - Identifier of the page being navigated to


When navigating by token, form a url of the following form:


<root-path-to-site>/frame/token/:token_id/:app/:page_id
where:

1. root-path-to-site - data transfer protocol (http\https) + domain name of the site being navigated to,
2. frame/token - route for navigating to a page by token,
3. token_id - user token for authorization,
4. app - name of the Application to navigate to,
5. page_id - Identifier of the page being navigated to


Session\token problems

When there are session\token problems, logout occurs, after which you can log in. At the moment of login the
session is overwritten


### Redirect from outside with filter substitution


![Redirect from outside with filter substitution](images/p104-01.jpg)

For integration with other products, the platform provides a mechanism for navigating from outside. This allows navigating to
a CORE page and also passing filter values.


A system page is created for navigation — redirect.

To get a navigation link, substitute an encrypted JSON with filters into a URL of the form: http://core address/redirect
/encrypted JSON .

Encryption is done with the method encodeURIComponent(btoa(unescape(encodeURIComponent(str)))), where str is a string
transformed via JSON.stringify.


String format

1. page - address of the page to navigate to. Specified according to the redirecturl attribute principle
2. filter - specifies the data passed to the page. Both standard input fields (column) and global variables can be used.


Example:

1. Original data set: {"page": "1","filter":{"cv_name":"Account Grid"}}
2. Encrypt: encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify({"page": "1","filter": {"cv_name":"Account Grid"}})))))
3. Resulting string: "eyJwYWdlIjoiMSIsImZpbHRlciI6eyJjdl9uYW1lIjoiQWNjb3VudCBHcmlkIn19"
4. Form the navigation link: http://core address/redirect /eyJwYWdlIjoiMSIsImZpbHRlciI6eyJjdl9uYW1lIjoiQWNjb3VudCBHcmlkIn19


### Redirect to a page


![Redirect to a page](images/p106-01.jpg)

Redirect to a page by a button-column in a grid
Configuration procedure
Redirect to a page by hyperlink
Configuration procedure
Principle of writing values on navigation
Search algorithm on Redirect


Redirect to a page by a button-column in a grid
This functionality allows navigating from one page to another with filtering of the main grid by

given parameters when clicking a button-column .

For example, when navigating from the Pages page to the Objects page, a specific object must be displayed.

To do this, the id of the specific object is passed into the filter on the destination page (in this example — into a global
variable that the grid SYS Grid Object << DO NOT CHANGE gets via the getglobal attribute).

Configuration procedure

To configure page navigations:

1. add the button-column Menu Redirect Column Icon << Reusable to the grid from which navigation will be performed.
2. add an object of class Menu Redirect to the same grid. for this object perform the following settings:

in the redirecturl attribute specify the URL of the page to navigate to by hyperlink. Example: bfl_1
in the columnsfilter attribute specify the list of fields that will be used for filtering on navigation,
comma-separated without spaces. Syntax is the same as columnsfilter settings for hyperlinks

If another navigation to a different page needs to be added to the selected grid, add another
object of class Menu Redirect to the grid with the corresponding settings.


Redirect to a page by hyperlink
This functionality allows navigating to a page with given filter parameters when clicking a
hyperlink.

Hyperlinks can be added:

in text fields (Field Text);


text columns (Column String).

Configuration procedure

To configure hyperlinks:

1. on the Pages page select the column or field that will contain the hyperlink
2. in the redirecturl attribute specify the URL of the page to navigate to by hyperlink. Example: bfl_1
3. in the columnsfilter attribute specify the list of fields that will be used for filtering on navigation, comma-separated without spaces.

Example:

ck_mo_ca=ck_mo_room,ck_mo_parent=ck_mo, where

ck_mo_ca, ck_mo_parent - fields of the page from which hyperlink navigation is performed. Data of these fields will
be assigned to the fields ck_mo_room and ck_mo respectively on navigation.


> **Important!**
> The main grid service must contain filtering by the fields ck_mo_room and ck_mo (for the page being
> navigated to).


Principle of writing values on navigation

1. An object with values for navigation is assembled (params)
2. From params, values are set into fields when such fields are found, and these values are then removed from params. Thus only those values that should not explicitly affect field values remain in params.
3. All remaining parameters, after removal, go into global variables. Thus only those variables that should affect queries non-explicitly (for example getgloabaltostore) are left


Search algorithm on Redirect

1. Clear all previously applied filters on the page being navigated to, regardless of whether it is open or closed.
2. Set defaultvalue and defaultvaluequery values into filter fields
3. Set values from columnsfilter into filter fields
4. Set globals on filter fields if needed
5. Get globals on filter fields if needed
6. Perform the search itself.


### Reusable objects

![Reusable objects](images/p107-01.jpg)

A reusable object is an object that is used many times in different places of the system by
binding this object directly to a page.

The main idea is not to program and draw typical objects several times, thereby reducing
development and support costs.

Reusable objects are located at the top level in the object hierarchy (i.e. have no parent) and have the mark "<< Reusable".

To connect a reusable object to a page:

1. select the parent object for the Reusable object on the Pages page;
2. Click the "Add" button and in the list of objects select the required Reusable object;
3. Save.

When configuring Reusable object attributes, it should be clearly understood that a change on the "Object" will affect all
pages where this Reusable is used; and overriding an attribute on the "Page" — only the specific page. In the first
case changes are saved in t_object_attr, in the second — in t_page_object_attr.


### Global variables

This functionality extends the ability to pass
data from one metamodel module to another. Global
variables are declared only within one
Page. Therefore global variable configuration Initialization
is done on the Pages page. Naming global variables
Super global variables


Initialization


> **Important!**
> Before initializing a global variable, specify its name and description on the
> "Global variables on the page" tab on the Pages page.


The global variable name must always start with "g". For example, gk_id.


Naming global variables

The naming principle should be based on variable naming as in the DB:

1. gv_value - text value
2. gd_date - text representation of a date
3. gn_number - numeric value
4. gt_zona - text representation of a date with a time zone specified
5. gl_boolean - boolean value, must be 0 or 1. Empty is allowed.
6. gk_id - primary key, can take values both as a string and numeric


Using global variables here

Super global variables
Super global variables are variables that come from:


1. system settings, everything that starts with g_sys
2. theme, localization - specified in system settings
3. session, starts with g_sess

These variables are automatically propagated to all pages and can be accessed in attribute settings.
---
They cannot be set on the "Global variables on the page" page, because this overwrites their values and is essentially an
override for these variables


#### Using global variables



![Using global variables](images/p110-01.jpg)

![Using global variables](images/p110-02.jpg)

Initialization
The setrecordtoglobal attribute
The Getglobal attribute
Concatenation ("gluing") of values
The Getglobaltostore attribute
Behavioral (Behavior) attributes


> **Important!**
> Before using a global variable, add it to the list of Globals on the page. Details


Initialization

The setglobal attribute is used to initialize a global variable.


When setglobal is declared on the grid itself, the global variable will pass the ck_id value of the selected
record in the grid.
If a value other than ck_id needs to be passed as a global, setglobal is declared in
the form:

"cv_name=gv_name", where

cv_name - name of the column (column) whose value will be passed as a global
variable,

gv_name - name of the global variable.

setglobal can also be set for the column itself if it is in the grid. Then only the name of the global variable is specified
in that column's setglobal.
It is also possible to set several global variables in setglobal for grids, Combobox, Field Grid, etc.
In this case global variables are specified comma-separated without spaces:

cv_name=gv_name,cv_comment=gv_comment


If needed, a global variable value can be set on page initialization.

To do this:

1. go to the Pages page (CORE GUI Constructor Pages);
2. select the page for which the global variable will be set;
3. click the "Add" button if a new global variable is being created, or the "Edit" button for an existing global;

4. in the "Value on initialization" field specify the required value and click the "Save" button.


The setrecordtoglobal attribute

On initialization, passes the entire selected row as an object into a global variable.

Example: g_test: {"ck_id":"all","cv_name":"Все","cv_description":"все атрибуты"}


The Getglobal attribute

If a global variable value needs to be passed to a specific field/column, specify
the global variable name in the getglobal attribute of the specific field/column.

Concatenation ("gluing") of values

Using global variables allows concatenating values of several fields into one.

1. declare global variables using the setglobal attribute
2. specify concatenation conditions in the getglobal attribute of the required object (field)

Example:

The getglobal attribute value = gv_name||'555cnh', where

|| - concatenation character,

'555cnh' - any text (specified in single quotes),

gv_name - name of the global variable (specified without quotes).

Concatenated field value (assume gv_name = глобальная ): глобальная555cnh


The Getglobaltostore attribute

When a global variable name is specified in the getglobaltostore attribute, its value will be passed into the filter
of the receiving object's service. Used for objects that call services (for example, Grid, Field Combobox, etc. )


Behavioral (Behavior) attributes

So-called behavior attributes affect the behavior of an object on a page.

Attribute Comment
name

activerules Rules for selecting the active element

Used for Field Combobox and Application.

disabledrules Condition under which the object will become inactive (unavailable for editing).

Used for fields/buttons/columns.

hiddenrules Condition under which the object will be hidden from display.

readonlyrules Condition under which the object will be available for read-only. Editing
functions will be unavailable.

requiredrules Condition under which the object will become required

reqcountrules Condition under which the number of required fields in
a Field Group changes.

Has priority over reqcount.

Syntax:

'==' - equal
'!=' - not equal
'>' - greater
'<' - less
'&&' - and
'||' - or

'!gk_mo' - empty field on which a global variable is set

'ck_id=="setting"||ck_id=="remove"' - when comparing with a string, wrap only in double quotes; single quotes
cannot be used

'('debt' in gk_d_anomaly)'- when a value needs to be compared with an array.

Example:

The hiddenrules attribute value = gk_mo>1

Behavior: If the global variable gk_mo is greater than 1, the field will be hidden and will not be displayed in the interface.


The window for configuring behavioral attributes allows validating the entered value immediately:


### File upload/download by button


![File upload/download by button](images/p112-01.jpg)

![File upload/download by button](images/p112-02.jpg)

To implement import/export of files to/from Core:

1. create a button (Button) that will invoke the file import function;
2. Configure its attributes:


Attribute name Possible values Comment

extraplugingate Name of the gateway plugin
that performs upload/download

filemode single - single upload; multi - File upload type. If not
ability to upload several filled in, single is used
files at once

filetypes doc,docx,pdf,zip,txt,ods,odt,xls,xlsx Available file types

maxfile Maximum file size in
bytes

mode 7 - export files from Core 8 - Operation type
upload files to Core

updatequery Required attribute Name of the service that performs
upload/download

3. the file storage location is determined by the corresponding plugin. Either the plugin specified in extraplugingate is taken, or the plugin used by the provider of the service specified in updatequery

Service example:


```
select pkg_json_doc.f_modify_doc(pn_user => :sess_ck_id,
                                       pv_session => :sess_session,
                                       pc_json => :json,
                                       pb_file => :upload_file,
                                       pv_filename => :upload_file_name)
as result
```


#### Row-by-row parsing when uploading XLSX and CSV files

![Row-by-row parsing when uploading XLSX and CSV files](images/p114-01.jpg)

To implement this:

1. create the extractorfiletojson plugin with correct settings


Plugin configuration example

2. create a service to save the parsed file. For example, TestXLSX
3. create a button (Button) for file upload
4. on the button specify attribute values:

Attribute name Value Comment

extraplugingate extractorfiletojson Name of the created parsing plugin

mode 8 File upload mode

updatequery TestXLSX Name of the created parsing and storage service


File upload looks as follows:

1. Click the button that invokes upload
2. in the window that appears, select a file to upload
3. on successful upload the system will display a message about successful completion of the operation

4. the response from the upload plugin will look as follows:


### How to configure an "Hourglass" object

![How to configure an "Hourglass" object](images/p115-01.jpg)

![How to configure an "Hourglass" object](images/p116-01.jpg)

![How to configure an "Hourglass" object](images/p116-02.jpg)

![How to configure an "Hourglass" object](images/p116-03.jpg)

An object of type "Hourglass" can be created in a parent object of class:

1. Window - for custom windows;
2. "String" column (Column String) - for auto-assembled windows;
3. Panel.


To create an "Hourglass" object:

1. Create an object of class "Hourglass" field (Field Item Selector);
2. In Field Selector, 2 grids are created:
1. data available for selection;
2. selected data.
3. Settings for the grids:
1. The unique identifier (ck_id) of a record in both grids must describe the same entity;
2. services must be bound to both grids;
3. the service modifier must be able to work with an array of data;
4. set the selmode attribute = MULTI on both grids;
5. to hide control buttons on the grids, set the hideactions attribute = true on both grids.


Configuring masters

An example of correct master configuration when creating additional entity characteristics using an object of type
"Hourglass":


1. Main grid "Roles" (Roles Grid) - the list of all roles in the system;

2.

2. Child grid "Actions" (Role Actions Grid)- the list of actions used in the specified role;


3. Window "Configure role actions" in the "Actions" grid - "Hourglass" (Field Item Selector) with 2 grids:
1. "Available actions" (Аvailable Action Grid);
2. "Selected actions" (Selected Action Grid)


4. For correct work, specify the "Roles" grid as the master for the following objects:
1. "Actions" grid (Role Actions Grid);
2. "Hourglass" object (Field Item Selector);
3. "Available actions" grid (Аvailable Action Grid);
4. "Selected actions" grid (Selected Action Grid):

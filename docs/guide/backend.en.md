# Back-end

[Русский](backend.md)


This page describes development and coding rules


> **Important!**
> Front-end determines entity uniqueness by the ck_id parameter, therefore any query must contain a unique
> entity identifier (ck_id).


> **Important!**
> When processing data on the backend, follow the “distrust principle” toward the frontend and the gateway.


1. Field requiredness, data format, etc. – must always be validated on the backend
2. If an input field on the frontend is active only when creating data and then locked during editing – do not take the value from the frontend; take the existing value from the DB, because frontend data may have been compromised


## Error handling

This page describes error handling rules on the back-end and response formation for the front-end


Returned data format
Macros / dynamic text
Package pkg
Packages of type pkg_json_*
Packages of type pkg_*
Error pools


Returned data format
An error or a list of errors returned to the front-end must be formatted in JSON so that the path to them
is $.cv_error, containing an array of values

Correct output examples:


```
"cv_error":{"23":[]}

"cv_error":{"1001":[],"1003":[],"1306":[]}
```

The brackets may contain dynamic text macros.


Macros / dynamic text

Formation of errors containing macro(s) for custom text substitution is supported.

Usage example:

In s_mt.t_message:


```
ck_id = 14 ; cv_text = Существует объект "{0}", связанный через ИД мастер-объекта
```

Corresponding call:


```
pkg.p_set_error(14, vv_texterror);
```

I.e., the error text itself may contain macros of the form {0} .. {n} .. {4}

The pkg.p_set_error method (as well as p_set_warning and p_set_info) can accept up to 5 text macros inclusive.


Package pkg
contains global variables that store lists of errors, warnings, and informational
messages - gv_error, gv_warning, gv_info. The same package also contains methods used for handling
exceptions, filling those global variables, resetting them, and forming the final cv_error to
pass to the front-end.


Packages of type pkg_json_*
Functions of such packages must contain:

1. At the very beginning - a call to pkg.p_reset_response to clear global variables
2. Throughout the method - logical checks of the form if pkg.gv_error is null then / if pkg.gv_error is not null then
3. On return, to form cv_error - pkg.p_form_response (exception for the exception when others block - you may leave error 512 output in explicit form)

As a result these functions return to the front-end a string into which the current gv_error, gv_warning, gv_info values are concatenated


Packages of type pkg_*
Procedures of such packages must contain:

1. When implementing business logic - adding errors via pkg.p_set_error( n ), as well as warnings and informational messages via pkg.p_set_warning, pkg.p_set_info
2. Throughout the method - logical checks of the form if pkg.gv_error is null then / if pkg.gv_error is not null then
3. In the exception block - a uniform construct of the following form:


```
exception
  when others then
    pkg.p_handle_exception(sqlcode);
```

As a result these procedures do not return a response string, but fill the global variables gv_error, gv_warning, gv_info


Error pools
All error codes are maintained in the t_message table. Besides errors, this table also stores warnings and
informational messages, distinguished by the cv_type field.

Logically the t_message table is divided into pools:

Code pool bounds  Pool purpose


<= -100 Unused; not currently planned for use

from -1 to -99 Recommended: Migration/integration errors

0 No errors, “success”

1-499 Metamodel module errors (logical errors when working with the Constructor)

500 - 999 System errors (obviously incorrect calls, handling expected ORA during multi-user
work, etc.), handled gateway errors/messages

1000 Unknown error

> 1000 Regular project errors (invalid user input, invalid format, required
field not filled, etc.)


## Service for the Mask Input Field

When unique input masks for data are needed. The service is specified in the global settings "smart_mask_query".

The service must return fields:

ck_id unique identifier

cv_name name

cv_series_mask series mask if present

cv_number_mask number mask

cv_series_mask_desc message in case of an invalid series

cv_number_mask_desc message in case of an invalid number


Example:

ck_id 7

cv_name Military ID

cv_series_mask ББ

cv_number_mask 999999

cv_series_mask_desc Document series input format "ББ", where Б is a required
Russian uppercase letter

cv_number_mask_desc Document number input format "999999", where 9 is a
required digit


## Development standard


This page describes development and coding rules adopted in projects that use the Metamodel as
a platform.


Introduction
Legend
SQL object naming
PL/SQL object naming
Service naming
Commenting rules
SQL
PL/SQL
Reports in Jasper Reports

General code writing rules
JSON
Sorting, filtering, pagination
Date format
Processing on backend oracle
float fields (pkg_json_*)
string fields (pkg_json_*)
cd_en fields (pkg_*)
Frontend distrust principle
DDL samples

```
      Create Table oracle
      Create Sequence
Рекомендуемые конструкции
      Выборка данных по максимальной дате
Форматы данных
      Формат массива
      Формат boolean
      Формат number
      Остальные форматы данных
```

Introduction
DB objects, services, and queries must be given names that reflect their purpose. Object names
must contain English alphabet characters and may also contain some special characters (_#$).
Transliteration is not allowed (only English words and their
abbreviations must be used). When naming objects, check that names are semantically correct using the following
tools:

https://www.lingvolive.com/en-us
https://en.oxforddictionaries.com
http://dictionary.cambridge.org
https://www.google.com (a word/phrase in quotation marks «» to analyze how widely such a word is used; analysis
of search-result relevance)


Legend
[] – optional elements

<semantic constant> – an abbreviation of the actions performed or included in the object, or a data type

<group> – a logical prefix that groups objects by type/module/layer. The allowed prefix length is
from 2 to 4 letters inclusive.

The project has a document with approved prefixes/abbreviations. Arbitrary group names
(not recorded in the project document) are forbidden.

<name> – object name without a prefix


SQL object naming
In alphabetical order:

CONTEXT – ctx_<name>

CONSTRAINTS – cin_<semantic constant>_<table name>_[number]

<semantic constant>:

C – check

P – primary key (cannot have a number at the end)

U – unique key

R – referential integrity (foreign key)

The table name is specified without the t_ prefix

Example:

Table t_example, primary key – cin_p_example, foreign key – cin_r_example_1

DATABASE LINK – dl_<schema being referenced with prefixes>

Example: dl_gv

The table name is specified without the s_ prefix

DIRECTORY – dir_<name>

FUNCTION – f_[<semantic constant>]_<name>

<semantic constant>: get – get information

set – data modification

check – validation

INDEX – cin_<semantic constant>_<table name>_[number]

<semantic constant>: P – primary key (cannot have a number at the end)

U – unique key

R – referential integrity (foreign key)

For non-unique indexes on several columns <semantic constant> is omitted, for example table t_example
index on several table columns cin_example_1

JAVA CLASS – JC_<name>

JAVA RESOURCE – JR_<name>

JAVA SOURCE – JS_<name>

JOB – job_<name>

JSON – j_

LIBRARY – lb_<name>

MATERIALIZED VIEW – mv_[<group>]_<name>

PACKAGE – pkg_[<group>]_<name> in oracle; in postgres this is how we name schemas that contain functions and procedures

PACKAGE BODY – exactly the same as PACKAGE

PROCEDURE – p_[<semantic constant>]_<name>

The same requirements apply as for FUNCTION

PUBLIC SYNONYM – creation of this synonym type is forbidden due to information security restrictions.

QUEUE – q_<name>

SCHEMA – s_<name>

SCHEDULE – job_<name>

SEQUENCE – seq_<table name>

PRIVATE SYNONYM – the synonym name must match the name of the target object

TABLE – t_[<group >]_<name>

Arbitrary group names (not recorded in the project document) are forbidden.

Plural forms are forbidden in table names (pick a synonym or name
the entity more abstractly).

The maximum table name length is 24 characters (including the T_ prefix; without the prefix – 22 characters).

TEMPORARY TABLE – tt_<group >_<name>

The same requirements apply as for TABLE

TRIGGER – tr_<semantic constant>_<table name>

<semantic constant>: b – before

a – after

c – compound

i – insert

u – update

d – delete

s – statement

Example: tr_bi_table_name

OBJECT TYPE – ot_<group >_<name>

COLLECTION TYPE – ct_<group >_<name>

VIEW - v_[<group >]_<name>

The same requirements apply as for TABLE

XML SCHEMA - x_<group >_<name>

Column names in tables, views, collections, arrays, and object types:

c<semantic constant>_<name>

<semantic constant>:

Char – forbidden in oracle

Long – forbidden in oracle

Varchar – forbidden in oracle

Varchar2 – v => cv_data

Date – d => cd_date

Number | BIGINT – n => cn_number

CLOB | TEXT – c => cc_lob

BLOB | BYTEA – b => cb_lob

XMLType – x => cx_schema

Timestamp – t => ct_zona

Number(1) | SMALLINT – Boolean replacement – l => cl_boolean (such a field must be not null; only 0
or 1 may be stored)

INTERVAL – i => ci_day_to_second

Reference list => cr_list (a mini lookup; the data type may be number or varchar2; a constraint must be created on
the field checking allowed values)

User-defined type – u => cu_<user-defined type name>

Primary key – k, always named ck_id in all tables; must be present in all tables

Secondary key – k, format:

ck_<parent table name>

(references the primary key of the parent table)

The parent table name is specified without the t_ prefix

A table’s self-reference must be named ck_parent

Prefix for service parameters: j

For example, jl_sort, jn_offset


PL/SQL object naming
Local variables – v<semantic constant>_<name>

Global variables – g<semantic constant>_<name>

Method parameters – p<semantic constant>_<name>

<semantic constant>: in this context, the column data type

Char – forbidden in oracle

Long – forbidden in oracle

Varchar – forbidden in oracle, postgres v, vv_data

Varchar2 –oracle v, vv_data

Date – d, vd_date

Number | BIGINT – n, vn_number

CLOB | TEXT – c, vc_lob

BLOB | BYTEA – b, vb_lob

JSON – j, vj_json

XMLType – x, vx_schema

TIMESTAMP – t, gt_zone

BOOLEAN | SMALLINT – l, vl_flag, an exception is made for functions called from sql, where the parameter may be NUMBER(1),
and for naming variables related to logical table column names

Reference list => vr_list (a mini lookup; the data type may be number or varchar2)

CURSOR – cur, vcur_sql, the cursor name is always cur_, and the cursor variable name in a loop is vcur_

Variables passed into a cursor always have the prefix r[data type]_

Package global cursors also start with cur_

Sys_ref_cursor – ref is the cursor name itself, vref_ is the variable name


```
EXCEPTION – ex, vex_exception_name
```

TYPE trt_record IS RECORD – for records ot_record, variable name vot_record;

TYPE tct_collection IS TABLE – for collections ct_collection, variable name vct_collection;

Primary key – k, must be named in the format vk_<table name>

User-defined type – u, must be named vu_<user-defined type name with prefix>


Service naming
Query-service names must contain a structured prefix and a functional description of the action
performed by the service. CamelCase should be used.

Examples of how services are named in BFL:

all internal dictionaries start with "D" - DContract, DDomesticSystem, DGenderType, etc
all ES NSI dictionaries (or other NSI calls) start with "jNSI" - jNSIBIK, jNSIGetAddrArea,
jNSIGetAddrByMO, jNSIOKTMO
services for displaying grids are usually named as "layer prefix" + "Show" + "logical part":
MOShowBuildings, CAShowPersons, OrgShowOrganizations
all Constructor engine (Metamodel) service names start with either MT or Get


Commenting rules

SQL
Comments on tables and fields must match the names in the ER model; these comments must be filled in
mandatorily.


PL/SQL
Package description in the header in the format

-- Purpose: package purpose, main functions performed by the package

Description of functions and procedures in the format:

/* Brief semantic description, 1-2 sentences, in Russian or English

Parameters that require explanation

*/

Comments for cursors (explicit and implicit) are mandatory. Any format is fine, the main thing is to

describe the meaning.

Comments for complex blocks are mandatory; the main thing is to describe the overall meaning.

Comments for package global variables are mandatory.

The comment format may be changed depending on the software that will collect
documentation.


Reports in Jasper Reports
All scripts contained in Jasper template datasets must be commented as follows:

/*< >< >< >< >*/

/* 2_6 . 50.02.03 50.06.03*/


/*< >< >< >< Header>*/

/* 2_6 . 50.02.03 50.06.03 */

Header.


/*< >< >< >< , , >< >*/

/* 2_6 . 50.06.03 */

Dataset. , Dataset_mo_improvement Dataset_room_part_living,
.


In a tabular script all fields must be commented according to these fields’ names in the FS. Fields in
the script must also be named according to the general BFL convention, for example cv_name_service; if possible do not name fields
with generic names like field_1, field_2.

Variables in the template must also be named according to the BFL convention. E.g. vk_nsi_org_department or vk_period

The templates themselves must contain a description in the Description and Report Name property fields.


General code writing rules
It is forbidden to use the char, varchar (for oracle), long data types
For table columns that store numeric values, always use the NUMBER(n,m) type
A query or a package containing several queries must be written in a single format: either ANSI syntax
or ORACLE syntax. When the syntax has to be changed to improve the query execution plan,
the reason must be stated in comments.
If the system is being written from scratch, always use either ANSI syntax or ORACLE syntax
Names of any objects or variables must consist of characters a-z, A-Z, 0-9,_; any other characters
are forbidden
Columns in a query must always contain an alias of the table they belong to, even if it is
a query against a single table
It is forbidden to use * in queries instead of a column list
Front-end determines entity uniqueness by the ck_id parameter, therefore any query must contain
a unique entity identifier (ck_id)
It is forbidden to use another view belonging to the same schema inside the body of a view or a materialized view
In an insert operation the column list must always be specified:


```
 Insert into table (id1,id2,id3) ………

Для логических столбцов используется только number(1) где 1 = true, 0 = false.
Обязательно делать CHECK, описывающий допустимые значения для всех логических столбцов
Запрещено создавать методы (function и procedure) вне пакетов

Запрещено использовать триггеры
Единый пакет констант с наименованием PKG
Наименование констант не подчиняется правилам наименования глобальных переменных и должно быть как можно
короче и в верхнем регистре. Например pkg.I pkg.U pkg.D
В отдельных select-ах указание схемы запрещено
Alias при написании запросов формируется по первым буквам из имени таблицы, т.е.: t_object => o , t_page_object =>
po, etc.
```

JSON
A unified standard for returning and receiving parameters plays an important role for the Constructor (metamodel).

When sending data from the backend to the frontend, a single parameter is always passed; it is named JSON and contains data in
JSON format (see any service from t_query as an example).

When receiving data from the frontend to the backend, the following parameters are passed:

page_object - object ID from the t_page_object perspective
session - session (session data is available in services, for example sess_ck_id and sess_session)
json - contains the payload; this should be described in more detail, see below

When passed from the frontend to the backend, the json parameter may contain three data blocks:

service - system information, in particular cv_action
data - the data itself
filter - data for filtering, sorting, and pagination - see below


Sorting, filtering, pagination
Any query must contain an order by:
if the query is used in a grid - order by &SORT (do not sort on the backend; sorting will come from the frontend, but
you may append your own sorting after the frontend sorting:

order by &SORT, cn_field1, cv_field2 )

if the query is used in a Panel History (PID) - order by cd_st desc
if the query is used in a dropdown list - order by ck_id (may be changed according to
specification requirements)
A grid query must contain the &sort and &filter macros
If there are additional conditions besides those from &filter, wrap the macro in parentheses:


oracle:
where cs.ck_con = json_value(:json, '$.master.ck_id' returning number)
and ( &FILTER )

postgresql:
where cs.ck_con = (:json::json#>>'{master.ck_id}')::bigint
and ( &FILTER )


For a grid object created in the Constructor, the orderproperty attribute must be filled in. Otherwise
the grid cannot be displayed (provided a service is already bound to the grid). Thanks to this, the GUI will always
explicitly show which field the data is sorted by (even in the case of default sorting)

For the grid to work correctly when adding a new record or editing an existing one while
using filters/pagination, a filter by the main table’s ck_id must be added to the grid service:

oracle:
/*##filter.ck_id*/and t.ck_id = json_value(:json, '$.filter.ck_id'
returning number)/*filter.ck_id##*/

postgresql:
/*##filter.ck_id*/and t.ck_id = (:json::json#>>'{filter.ck_id}')::bigint
/*filter.ck_id##*/


If the grid contains multi-component data, the refreshallrecords attribute must be filled in for it in the Constructor
to refresh all grid rows.

There are two kinds of pagination: with the page count displayed and without it (this is controlled by the
paginatortype attribute)

Example JSON received from the front-end for sorting, filtering, and pagination:


json:{"filter":{"cv_short":" ", "cv_inn":"5634623656", "jl_sort":
[{"property":"cd_st","direction":"ASC"}], "jl_filter":[{"operator":"
eq","value":"2017-10-25 00:00:00","property":"cd_st"}], "jn_offset":10,
"jn_fetch":5}}


In the SQL code of a grid query this is handled as follows:


oracle:
...
where 1=1
/*##filter.cv_short*/and lower(org.cv_short) like '%' || lower
(json_value(:json, '$.filter.cv_short' returning varchar2)) || '%'
/*filter.cv_short##*/
/*##filter.cv_inn*/and org.cv_inn like '%' || json_value(:json, '$.
filter.cv_inn' returning varchar2) || '%'/*filter.cv_inn##*/
)t
where &FILTER
order by &SORT
offset &OFFSET rows
fetch next &FETCH rows only

postgresql:
...
where true
/*##filter.cv_short*/and lower(org.cv_short) like '%' || lower(:json::
json#>>'{filter.cv_short}') || '%'/*filter.cv_short##*/
/*##filter.cv_inn*/and org.cv_inn like '%' || :json::json#>>'{filter.
cv_inn}' || '%'/*filter.cv_inn##*/
)t
where &FILTER
order by &SORT
offset &OFFSET rows
fetch next &FETCH rows only

Note the /*##filter.name*/ + /*filter.name##*/ macros (they come as a pair, opening and closing
macros respectively).

These macros must be used in all cases where the filter is not mandatory.

The goal is to lighten the DB query (otherwise a larger number of ORs has to be done in the where block).

These macros are processed by the middle layer, and if the filter is not specified, the macro contents are simply erased from
the executed query.

Example of forming fields on the back-end for pagination:

In the SQL query, in the select block:


/* */
row_number() over(order by &SORT)as jn_rownum,
count(1) over() as jn_total_cnt,


In the resulting JSON you get:


"jn_rownum":1,"jn_total_cnt":9


Date format
JSON uses the ISO 8601 date format, which looks as follows:
yyyy-mm-ddThh:mm:ss
for example:
2008-09-15T15:53:00

This date format is used on the front-end; the same format is obtained when we convert a date to json_object in the DB.

Example:


oracle:

```
select json_object(
        ...
        key 'cd_st' value t.cd_st,
        key 'cd_en' value t.cd_en,
        ...
        ) as json
 from table t
postgresql:
select json_build_object(
              'cd_st', to_char(t.cd_st, 'yyyy-mm-dd"T"hh24:mi:ss'),
              'cd_en', to_char(t.cd_en, 'yyyy-mm-dd"T"hh24:mi:ss')
              ) as json
      from table t
```

When writing modification methods in pkg_json_* packages, inside the from() block specify that it is a string and
convert it to a date:

oracle:

```
select to_date(jt.cd_st, 'yyyy-mm-dd"T"hh24:mi:ss'),
                 to_date(jt_cd_en, 'yyyy-mm-dd"T"hh24:mi:ss')
        into pot_org_role.cd_st,
                 pot_org_role.cd_en
     from json_table(pc_json, '$' columns
                                         cd_st varchar2(100) path '$.
data.cd_st',
                                         cd_en varchar2(100) path '$.
data.cd_en') jt;

postgresql:
select to_date(jt.cd_st, 'yyyy-mm-dd"T"hh24:mi:ss'),
                to_date(jt_cd_en, 'yyyy-mm-dd"T"hh24:mi:ss')
       into pot_org_role.cd_st,
                pot_org_role.cd_en
     from json_to_record(pc_json) as x(cd_st text, cd_en text);
```

When working with dates in JSON (getting a date from JSON format), Oracle provides several options:

1. Getting a date value using implicit conversion by specifying the returned type DATE or TIMESTAMP;
2. Getting the date as a string and converting it to a date format using the TO_DATE function.

The second option is preferable because when converting you control the specified format and there is less
chance of getting an error than with implicit conversion.

There is also a bug in Oracle (or a feature; it is not entirely clear yet) where getting a date value using
implicit conversion yields a date without time; to get the time you must specify the returned type
timestamp, which is probably not quite correct.

Work examples:


with
w_json as
(

```
     select '{datetime: "2008-09-15T15:53:00"}' f_json
       from dual
  )
select json_value(f_json, '$.datetime' returning
date)                  as dt,
              json_value(f_json, '$.datetime' returning timestamp)    as
ts,
              to_date(json_value(f_json, '$.datetime' returning varchar2
(100)), 'yyyy-mm-dd"T"hh24:mi:ss') as dt_2
  from w_json;

_______________________________________________________________
DT                  TS                                     DT_2
15/09/2008    15/09/2008 15:53:00,000000    15/09/2008 15:53:00
```

The example above shows a peculiarity of working with dates when getting them from JSON format, therefore it is recommended
to perform the conversion yourself.


Processing on backend oracle

float fields (pkg_json_*)
In pkg_json_* packages, for fields that imply the possibility of entering fractional numbers in the GUI, the following
processing should be applied:


-- JSON -> rowtype

```
select ...
           to_number(trim(jt.cn_loss_pct), rpad(lpad('D', 38, '9'), 63,
'9'), 'NLS_NUMERIC_CHARACTERS = ''.,'''),
           to_number(trim(jt.cn_loss_value), rpad(lpad('D', 38, '9'),
63, '9'), 'NLS_NUMERIC_CHARACTERS = ''.,'''),
         ...
  into ...
         pot_point.cn_loss_pct,
         pot_point.cn_loss_value,
         ...
  from json_table( ... )
```

As a rule, such fields are: percentages, tariffs, quantities, losses, etc.


string fields (pkg_json_*)
In pkg_json_* packages, for fields that imply the possibility of entering non-numeric characters in the GUI, the
JSON_table_on_error_clause should be specified explicitly as "error on error":

https://docs.oracle.com/database/121/SQLRF/functions092.htm#SQLRF56973


-- JSON -> rowtype

```
select ...
  from json_table(pc_json,
               cv_number varchar2(4000 char) path '$.data.
cv_number' error on error ,

            ...
```

Reason: by default null on error is applied, and if a string whose length exceeds the allowed length comes from the front-end,
null will be stored in the DB and no error will occur. With error on error an error message will be issued.


cd_en fields (pkg_*)
In pkg_* packages where the cd_en field is processed, saving data into this field must always happen with
the time 23:59:59. The following processing should be applied:

...


if pot_mo_service_norm.cd_en is not null then
pot_mo_service_norm.cd_en := trunc(pot_mo_service_norm.cd_en, 'DD')
+ to_dsinterval('0 23:59:59');
end if;


...


Frontend distrust principle
When processing data on the backend, follow the “distrust principle” toward the frontend and the gateway.

1. Field requiredness, data format, etc. – must always be validated on the backend
2. If an input field on the frontend is active only when creating data and then locked during editing – do not take the value from the frontend; take the existing value from the DB, because frontend data may have been compromised


DDL samples


```
Create Table oracle
```

When creating tables, always use the ROWDEPENDENCIES option (https://docs.oracle.com/cd/B19306_01/server.102
/b14200/pseudocolumns007.htm)

Do not describe tablespace etc.

Example:


```
        create table schema.table_name
        (
        ...columns...
        ) rowdependencies;


Create Sequence
```

Valid example:


```
create sequence schema.seq_name
minvalue 1
nomaxvalue
start with 1
increment by 1
nocache;
```

Recommended constructs

Selecting data by maximum date
Was:


--CAShowRoomsByMO OLD

```
select    mr.ck_id,
          mr.ck_mo,
          mr.cv_number
  from t_mo mo
  join t_mo_room mr on mr.ck_mo = mo.ck_id
                    and mr.cd_st = (select max(cd_st) from t_mo_room
where ck_mo = mo.ck_id)
 where mo.ck_parent = json_value(:json, '$.master.ck_id' returning
number)
 order by mr.cv_number asc
```

It is recommended to do it as follows:


--CAShowRoomsByMO

```
 Select ck_id,
         ck_mo,
         cv_number
  from (
 select mr.ck_id,
         row_number() over (partition by mr.ck_mo order by(mr.cd_st)
desc ) as cn_rn,
         mr.ck_mo,
         mr.cv_number
   from t_mo_room mr
   join t_mo mo
     on mr.ck_mo = mo.ck_id
  where mo.ck_parent = json_value(:json, '$.master.ck_id' returning
number))
  where cn_rn = 1
```

Reason: a second pass over t_mo_room is removed


Data formats
The data format applies when transferring from the frontend to the server. When transferring data from the server it is desirable
to follow the same rules, except that empty values may not be transferred, i.e. they may take the value undefined


Array format
1. When transferring an empty array ([]) or emptiness (undefined), convert to (null)


boolean format
1. When a field is not filled, convert to numeric (0). 2.

2. Data may be transferred only in 2 logical variants (0) or (1)


number format
1. May be transferred in 2 formats: string or number. The string format is transferred when the value is empty or exceeds the allowed number of digits (BigNumber)


Other data formats
1. When a field is not filled (undefined, null, ""), convert to an empty value ("")

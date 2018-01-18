## 查询

`SELECT [DISTINCT] */column [, other_column] FROM table [, other_table]`

查看整/某个数据表。

`SELECT COUNT(column) FROM table`

查看数据表有多少条记录。

`SELECT COUNT(DISTINCT column) FROM table`

查看不重复的数据记录有多少条。

`SELECT column FROM table`

限制查询结果中数据列的个数。

`SELECT column FROM table LIMIT [offset,] amount`

限制查询结果中的数据记录的个数。

`SELECT SQL_CALC_FOUND_ROWS cal_name FROM table LIMIT amount` & `SELECT FOUND_ROWS()`

查询不带 LIMIT 关键字时会返回多少条记录。

## 排序

`SELECT column FROM table ORDER BY column [DESC]`

对查询结果进行排序。

`SELECT column FROM table ORDER BY column COLLATE charset`

临时改用另一个排序方式对字符串查询结果进行排序（导致 MySQL 不使用任何索引进行排序）。

`ALTER TABLE table MODIFY column TYPE CHARACTOR SET one_charset COLLATE other_charset`

永久改变某个数据列（字符串类型）的排序方式（会使有关索引被自动更新）。

## 筛选

`SELECT column FROM table WHERE condition(column >= 'F')`

筛选出符合条件的记录。

`SELECT column FROM table WHERE column LIKE '%er%'`

查询姓名里包含字母序列 er 的作者（%代表任意字符串的通配符）。

`SELECT column FROM table WHERE column IN (6, 8, 10)`

枚举出符合条件的记录。

## 联表查询（两个）

`SELECT one_column, other_column FROM one_table, other_table WHERE one_table.rel_column = other_table.rel_column`

`SELECT one_column, other_column FROM one_table LEFT JOIN other_table ON one_table.rel_column = other_table.rel_column`

`SELECT one_column, other_column FROM one_table LEFT JOIN other_table USING (rel_column)`

关联字段必须同名。

## 联表查询（三个以上）

`SELECT one_column, other_column FROM one_table, other_table, another_table WHERE one_table.rel_column = another_table.rel_column AND other_table.rel_column = another_table.rel_column`

## 合并查询结果

`SELECT command UNION [ALL] SELECT command`

合并两条查询结果（不同表需保证各查询结果的数据列在个数和类型是一样的）。

默认过滤掉重复的结果，带上 ALL 会保留重复的结果。


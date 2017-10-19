## Node 类型

DOM1 级定义了一个 Node 接口，js 中所有的节点类型都继承自 Node 类型，因此`所有的节点都共享着相同的基本属性和方法`。

### nodeType

用 12 个数值常量表示节点的类型：

1. Node.ELEMENT_NODE(1)；
2. Node.ATTRIBUTE_NODE(2)；
3. Node.TEXT_NODE(3)；
4. Node.CDATA_SECTION_NODE(4)；
5. Node.ENTITY_REFERENCE_NODE(5)；
6. Node.ENTITY_NODE(6)；
7. Node.PROCESSING_INSTRUCTION_NODE(7)；
8. Node.COMMENT_NODE(8)；
9. Node.DOCUMENT_NODE(9)；
10. Node.DOCUMENT_TYPE_NODE(10)；
11. Node.DOCUMENT_FRAGMENT_NODE(11)；
12. Node.NOTATION_NODE(12)。

IE没有公开 Node 类型的构造函数，为了兼容，应将 nodeType 与数值进行比较。

### nodeName & nodeValue

值取决于节点类型。

### childNodes



### nodeLists

是类数组对象，DOM 结构的变化能自动反映到此对象中。

| 属性               | 说明   |
|------------------|------|
| nodelists.length | 成员数量 |

| 方法                               | 说明   |
|----------------------------------|------|
| nodelists[0] / nodelists.item(0) | 访问成员 |

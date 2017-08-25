var Person = (function () {
    function Person(name) {
        this.name = name;
    }
    Person.prototype.sayHello = function () {
        console.log("Hello, my name is " + this.name);
    };
    return Person;
}());
// class Employee extends Person {
//     private department: string;
//     constructor(name: string, department: string) {
//         super(name);
//         this.department = department;
//     }
//     public getElevatorPitch() {
//         return `Hello, my name is ${this.name} and I work in ${this.department}.`;
//     }
// }
var howard = new Person('Howard');
var jack = new Person('Jack');
howard.sayHello();
jack.sayHello();

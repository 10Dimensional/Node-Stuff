//Boolean
//String
//Number
//Undefined
//Null
//Symbol (no literal)

var length = "hello".length;
var length2 = new String("hello").length;

typeof "hello"; //string
typeof new String("hello"); // object
typeof String("hello"); //string
typeof new String("hello").valueOf(); //string

typeof 10; //number
typeof new Number(10); //object
typeof Number(10) //number
typeof new Number(10).valueOf; //number

var hello = "hello";

hello.foo = "foo";
hello.foo; //undefined

//Just USE primitive values. Primitive types are quickly converted into objects 
//in order to manipulate them, but then destroyed after retrieving the result.

var num =  new Number(10);
var sum = 10 + num; //being coerced into a number

num.foo = "foo";
num.foo ; //foo -- Is now a number object, so properties can be added to.

var value = new Boolean(false);

if (value) {
	alert("foo"); //We would see alert because the Boolean is an object not a primitive type, and objects are truthy values.
}

/* WRAP UP: USE PRIMITIVE VALUES, ONLY USE OBJECTS IN EDGE CASES */



var obj = new Object(); //Make object first

obj.firtname = "John";

//This is the old way we would populate objects with methods and properties

//Javascipt doesn't technically have methods, it has properties that are assigned to properties.

//Members -- public properties and methods

var obj0 = {
	property: "property",
	method: function() {
		
	}
}; //Object literal notation, most popular now

//The problem with this is that you have to re-create multiple objects, 
//even if they have the same interface

/* WRAP UP: N/A */



var obj1 = {
	firstname: "john",
	greet: function (name) {
		return "Hello" + name;
	}	
};

var obj2 = {
	firstname: "john",
	greet: function (name) {
		return "Hello" + name;
	}	
};

//This is pretty dope, but how do we mass produce objs like this?

//FACTORY PATTERN -----------------------------------------

function createPerson (firstName, lastName) {

	var person = {
		get firstName() { //Using get methods, we can protect the information being passed into the function
			return firstName;
		},
		get lastName () {
			return lastName;
		},
		greet: function (name) {
			return "Hello" + name + ".My name is " + firstName;
		}
	}
	
	return person;
}

var obj3 = createPerson("John", "Doe");
var obj4 = createPerson("Joe", "Smith");

//Why wouldn't you want to do it this way?

var obj5 = {} // new Object();

//When you use literal notation you're actually losing some of the functionality of JS

obj instanceof Object //Won't work because this object isn't an instance of anything!

//Functions are objects--every time we create an obj, the "greet" method, we're creating a new version of it.
//This is a waste of memory and time 

/* WRAP UP: Maybe don't use this so much? */


//So we should just define a new data type!

var Person = (function () { //Protects person inside of closure
	
	var firstNameSymbol = Symbol();
	var lastNameSymbol = Symbol(); //add privacy because symbols are NOT enumerated
	
	function Person(firstName, lastName) {
		this[firstNameSymbol] = firstName, //privacy! But this is NOT a property
		this[lastNameSymbol] = lastName;
	}
	
	Person.prototype.greet = function (name) {
		return "Hello" + name + ".My name is " + this.firstName;
	} //but this isn't actually on the object we create tho, which is a little bit of a problem
	
	Object.defineProperty(Person.prototype, "firstName", { //In order to actual give the person first and last name properties
		get: function () { return this[firstNameSymbol]; }
	});
	
	Object.defineProperty(Person.prototype, "lastName", {
		get: function () { return this[lastNameSymbol]; }
	});
	// ~Truuuuuue privacy!
});

//SO we can use prototypes

Person.prototype.greet = function (name) {
	return "Hello" + name + ".My name is " + this.firstName;
} //but this isn't actually on the object we create tho, which is a little bit of a problem

var obj6 = new Person("John", "Doe");
var obj7 = new Person("Joe", "Smith");

obj.greet(); //JS will look for greet in object, but won't find it because "greet" is in the prototype
//So it looks for a prototype in order find method, which takes a bit longer because JS has to find it

/* WRAP UP: This is good! But...so much code! */

person instanceof Person; //with the way we did this last time, this is now true

//But with ES6 we can use classes now!

class Person { //Awww yisss so much easier, but not supported by ANY browser yet
	constructor(firstName, lastName ) {
		this.firstName = firstName,
		this.lastName = lastName;
	}
	
	greet(name) {
		return "Hello" + name + ".My name is " + this.firstName;
	}
}

//This is creating the same thing as the code above, so we can do things like

Person.prototype.greet; //and it'll be true

//We have to use transpilers like Babel or Typescript in order to use ES6 at all
//ES6 module loader needed to create the modules we want

//How do we make this class private? We can make a module, using some of the functionality used before

var firstNameSymbol = Symbol();
var lastNameSymbol = Symbol();

export class Person { //When you import module, you can use this class in another file
	constructor(firstName, lastName ) {
		this[firstNameSymbol] = firstName, //privacy! But this is NOT a property
		this[lastNameSymbol] = lastName;
	}
	
	greet(name) {
		return "Hello" + name + ".My name is " + this.firstName;
	}
	
	get firstName() {
		return this[firstNameSymbol];
	}
	
	get lastName() {
		return this[lastNameSymbol];
	}
	//Only a getter because we don't want the name to ever be changed
	
	static renamePerson(person, lastName) {
		person[lastNameSymbol] = lastName;
	}

}


//Uh oh! Symbols don't have a polyfill for older browsers, 
//so how do we keep the privacy of our class?

//Feature called "weak map" can be used in IE9 or up, because it's polyfillbale
//Storage device with key value pairs, the key is an object

var Person = (function () { //Protects person inside of closure
	
	var map = new WeakMap(); //Values are weakly mapped, so references won't linger
	
	function Person(firstName, lastName) {
		map.set(this, {
			firstName: firstName,
			lastName: lastName 
		});
	}
	
	Person.prototype.greet = function (name) {
		return "Hello" + name + ".My name is " + map.get(this).firstName;
	} //but this isn't actually on the object we create tho, which is a little bit of a problem
	
	Object.defineProperty(Person.prototype, "firstName", { //In order to actual give the person first and last name properties
		get: function () { return map.get(this).firstName }
	});
	
	Object.defineProperty(Person.prototype, "lastName", {
		get: function () { return map.get(this).lastName }
	});
	// ~Truuuuuue privacy!
});



//Parasitic Inheritance ---------------------

//Typically see this with plain objects/factory functions

function createPerson (firstName, lastName) {

	var person = {
		get firstName() { //Using get methods, we can protect the information being passed into the function
			return firstName;
		},
		get lastName () {
			return lastName;
		},
		greet: function (name) {
			return "Hello" + name + ".My name is " + firstName;
		}
		
	}
	
	Object.defineProperty(person, "fullname", {
		get: function () { return this.firstName + " " + this.lastName; },	
		configurable: true
	});
	
	return person;
}

function createEmployee (firstName, lastName, position) {
	
	var person = createPerson(firstName, lastName);
	// var personGreet = person.greet; //this is a reference to the greet method in the person object
	var fullNameDescriptor = Object.getOwnPropertyDescriptor(person, "fullname");
	var fullNameGet = fullNameDescriptor.get.bind(person); //binding property to THIS person
	
	Object.defineProperty(person, "position" , {
		get: function () { return position; }
	});
	
	Object.defineProperty(person, "fullname" , {
		get: function () { return fullname + ", " + this.position; } //cannot do this! the property is not configurable by default
	});
	
	/*person.greet = function (name) {
		return  personGreet(name) + ", " + this.position;
	}*/
	
	return employee;
}

//The whole idea behind inheritance is to NOT copy and paste, duh! So...parastic inheritance!

//Prototypal Inheritance/True Inheritance ---------------------

//JS is a PROTOTYPAL language
//We use and manipulate PROTOTYPE CHAINS

var obj = {}; //new Object(); implied through literal notation

obj.__proto__ = Object.prototype; 
			  //this is SPECIALLLLLL, probably shouldn't modify it
			  //direct link to the prototype that was used to create this object
			  //final link in the prototype chain
			  
var john = new Person('john');

john.__proto__ === Person.prototype; //true
//JS looks at an object for a property first, then the prototype if it doesn't find anything
john.__proto__ == Person.prototype; //true
john.__proto__.__.proto__ == Object.prototype; //true, final link in the chain

//for example

john.toString(); //this would be found in Object.prototype OR
				//john.__proto__.__.proto__ 
				
//So everything inherits up from the chain!

function Person(firstName, lastName) {
	this.firstName = firstName;
}

Person.prototype.greet = function (name) {
		return "Hello" + name + ".My name is " + this.firstName;
}

function Employee(firstName, position) {
	Person.call(this, firstName); //Calls person AS this and sets the firstname variable as the firstname property of this object
	this.position = position;
}

Employee = Object.create(Person.property); //this sets the obj prototype = to the person prototype
//this makes it so Employee inherits everything from Person
//Makes it so we don't have to define greet method


Employee.prototype.greet = function (name) {
	return Person.prototype.greet.call(this, name) + ", " + this.position;
}

//However, the further you go down the chain, the longer JS will take to find stuff
//So gen rule is to keep prototype chains pretty short
//But this also depends on the properties you're using

//Class Inheritance/Best Inheritance~* ;) ---------------------

export class Person {
	constructor(firstname, lastName) {
		this.firstname;
		this.lastName;
	}
	
	greet(name) {
		return "Hello, " + name + ". My name is " + this.firstname;
	}
}

//la la la pretend this is a diff file

import {Person} from "person.js"

export class Employee extends Person {
	constructor(firstname, lastName, position) { //beautifullllll
		super(firstname, lastName);
		this.position = position;
	}
	
	get fullname() {
		return super.fullname + ", " + this.position;
	} //awww yissss dawg, not need to make a getterrrr
	
/*	get fullname() {
		return this.fullname + " " + this.lastName;
	}
	
	greet(name) {
		super.greet(name) + ", " + this.position; //overwrites greet
	}*/ //this is unnecessary! we don't need to overwrite anything because we can inherit shit!
}

//so long story short, thank fucking god for the super keyword!!

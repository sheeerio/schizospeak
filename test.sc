let foo = 9 * 5;
print(foo - 23)
const obj = {
    x: 100,
    y: "32",
    foo,
    complex: {
        bar: true,
    },
};

print(obj.complex.bar)

print(foo, 132)
const timeNow = time();
print(timeNow)

fn makeAdder(offset, i) {
    fn add(x, y) {
        x + y + offset
    }

    add
}

let x = -4;
const adder = makeAdder(3);
print(adder(10, 5))

if (x > 0) {
    if (x < 4) {
        print("x is less than 4 and positive")
    } else if (x == 4){
        print("x is equal to 4")
    } else {
        print("x is greater than 4")
    }
} else if (x == 0) {
    print("x is equal to 0")
} else {
    print("x is negative")
}


for (let i = 0; i < 4; i = i + 1) {
    print(i)
}
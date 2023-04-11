import axios from 'axios';
import { sendSql } from '../src/db/pool';
import * as fs from 'fs'
import path from 'path'


function generateRandomString(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}


beforeAll(() => {
    const folderPath = path.resolve("uploads")
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error(err);
            return;
        }

        files.forEach((file) => {
            const filePath = `${folderPath}/${file}`;
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
        });
    });

    return sendSql(`TRUNCATE TABLE students;`)
})

const random_student_id_1 = generateRandomString(8)
const random_student_id_2 = generateRandomString(8)

test('create a new student', async () => {
    const response = await axios.post('http://localhost:3000/api/students',
        {
            student_id: random_student_id_1,
            name: "David Laines",
            email: "a00835351@tec.mx",
            active: true,
            notes: "Notes about David Laines"
        }
    );
    expect(response.status).toBe(201);
    expect(response.data).toEqual({
        student_id: random_student_id_1,
        name: "David Laines",
        email: "a00835351@tec.mx",
        active: true,
        notes: "Notes about David Laines",
        picture_name: null,
        picture_type: null,
        picture: null
    });
});

test('create a new student', async () => {
    const response = await axios.post('http://localhost:3000/api/students',
        {
            student_id: random_student_id_2,
            name: "David Laines",
            email: "a00835351@tec.mx",
            active: true,
            notes: "Notes about David Laines"
        }
    );
    expect(response.status).toBe(201);
    expect(response.data).toEqual({
        student_id: random_student_id_2,
        name: "David Laines",
        email: "a00835351@tec.mx",
        active: true,
        notes: "Notes about David Laines",
        picture_name: null,
        picture_type: null,
        picture: null
    });
});

test('select all students', async () => {
    const response = await axios.get('http://localhost:3000/api/students');
    expect(response.status).toBe(200);
    expect(response.data).toHaveLength(2);
});

test('select a student by query param', async () => {
    const response = await axios.get('http://localhost:3000/api/students?id=' + random_student_id_1);
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
        student_id: random_student_id_1,
        name: "David Laines",
        email: "a00835351@tec.mx",
        active: true,
        notes: "Notes about David Laines",
        picture_name: null,
        picture_type: null,
        picture: null
    });
});

test('select a student by id endpoint', async () => {
    const response = await axios.get('http://localhost:3000/api/students/' + random_student_id_2);
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
        student_id: random_student_id_2,
        name: "David Laines",
        email: "a00835351@tec.mx",
        active: true,
        notes: "Notes about David Laines",
        picture_name: null,
        picture_type: null,
        picture: null
    });
});

test('update the field \'email\' of a student', async () => {
    const response = await axios.put('http://localhost:3000/api/students/' + random_student_id_1,
        {
            email: "davidlainesv@tec.mx"
        }
    );
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
        student_id: random_student_id_1,
        name: "David Laines",
        email: "davidlainesv@tec.mx",
        active: true,
        notes: "Notes about David Laines",
        picture_name: null,
        picture_type: null,
        picture: null
    });
});

test('removes an student', async () => {
    const response = await axios.delete('http://localhost:3000/api/students/' + random_student_id_2);
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
        student_id: random_student_id_2
    });
});

test('uploads a picture to a student', async () => {
    const fileData = fs.readFileSync(path.resolve(__dirname, "student_profile_picture.jpg"))
    const photoFile = new Blob([fileData], { type: 'image/jpeg' })

    const formData = new FormData()
    formData.append('picture', photoFile, 'profile_picture.jpg')

    const response = await axios.post('http://localhost:3000/api/students/upload-picture/' + random_student_id_1, formData)

    expect(response.status).toBe(201)
    expect(response.data["picture"]).toBeDefined()
    expect(response.data["picture_type"]).toEqual("image/jpeg")
    expect(response.data["picture_name"]).toEqual(random_student_id_1)
});
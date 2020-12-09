// export default function login(email: string, password: string) {
//     return fetch(`api/login`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ email, password })
//     })
//         .then((res) => {
//             if (!res.ok) throw new Error('Response is NOT ok');
//             return res.json();
//         })
//         .then((res) => {
//             console.log(res);
//             const { token } = res;
//             return token;
//         });
// }

export default async function login(email: string, password: string) {
    const res = await fetch(`api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json()
    console.log(data);    
    
    return data;
}
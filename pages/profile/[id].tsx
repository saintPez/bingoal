export default function Profile() {
    return (
        <>
            <h1>[id]</h1>
        </>
    );
}

export async function getServerSideProps({query}) {
    console.log(query);
    return {
        props: {}
    };
}

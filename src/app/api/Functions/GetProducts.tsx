

const GetAllProducts = async()=>{
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`,{
        cache: 'no-store'
    });
    const data = await response.json();
    return data;
}
export {GetAllProducts}
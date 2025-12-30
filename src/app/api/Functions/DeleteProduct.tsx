

const DeleteProductById = async(id:number)=>{
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`,{
        method: 'DELETE',
        cache: 'no-store'
    });
    const data = await response.json();
    return data;
}
export {DeleteProductById}
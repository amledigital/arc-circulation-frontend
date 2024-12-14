export function ConstructLink({_id, title,url}:{_id:string, title:string,url:string}) {
    let base = import.meta.env.PROD ? 'https://www.9and10news.com' : 'https://910.ledigital.dev'
        let editBase = import.meta.env.PROD ? 'https://910mediagroup.arcpublishing.com/composer/edit/' : 'https://sandbox.910mediagroup.arcpublishing.com/composer/edit/'
    return (
        <>
        <a href={base.concat(url)} title={title} aria-label={title} target="_blank" rel="nofollow noreferrer noopener">{title}</a> &nbsp;&mdash;&nbsp;
        <a href={editBase + _id } title={"Edit: "+title} aria-label={"Edit: "+title} rel="nofollow noreferrer noopener" target="_blank">Edit</a>
        </>
    )
}



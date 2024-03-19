const card = (props) => {
    return (
        <div className="card">
            <div className="card-image--container">
                <img src="https://test-fontend-dev.s3-us-west-2.amazonaws.com/photo.jpg" alt="forest image" className="card-image"/>
                <div className="card-image--label">
                    Number of Members : {props?.peopleLength} 
                </div>
            </div>
            <div className="card-body">
                <div className="card-body--subheader">
                    {props?.timestamp}
                </div>
                <div className="card-body--header">
                    {props?.name}
                </div>
                <div className="card-body--text">
                    {props?.description}
                </div>
            </div>
            <hr className="card-divider" />
            <div className="card-footer">
                <div className="card-footer--button" onClick={props.onClick} >
                    <span className='card-footer--text'>
                        Join Now
                    </span>
                </div>
            </div>
        </div>
    )
}

export default card;
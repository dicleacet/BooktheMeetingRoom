const card = (props) => {
    return (
        <div class="card">
            <div class="card-image--container">
                <img src="https://test-fontend-dev.s3-us-west-2.amazonaws.com/photo.jpg" alt="forest image" class="card-image"/>
                <div class="card-image--label">
                    Number of Members : {props?.peopleLength} 
                </div>
            </div>
            <div class="card-body">
                <div class="card-body--subheader">
                    {props?.timestamp}
                </div>
                <div class="card-body--header">
                    John Doe
                </div>
                <div class="card-body--text">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </div>
            </div>
            <hr class="card-divider" />
            <div class="card-footer">
                <div class="card-footer--button">
                    <span class='card-footer--text'>
                        Join Now
                    </span>
                </div>
            </div>
        </div>
    )
}

export default card;
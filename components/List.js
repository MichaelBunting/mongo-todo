import React from 'react';

const List = (props) => {
    return (
        <ul className="list">
            {props.list.map((listItem, i) => {
                return (
                    <li className="list__item" key={i}>
                        <div className="list__name">
                            {listItem.name}
                        </div>
                        <div className="list__time">
                            {listItem.time}
                        </div>

                        <div className="list__check" onClick={props.completeTask}></div>
                    </li>
                )
            })}
        </ul>
    )
}

export default List;
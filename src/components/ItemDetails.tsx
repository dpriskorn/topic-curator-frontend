import React, { useEffect, useState } from "react";
import { Item } from "../models/Item";

interface ItemDetailsProps {
  item: Item;
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ item }) => {
  const [description, setDescription] = useState("Loading...");

  useEffect(() => {
    item.fetchDescription().then(setDescription).catch(() => {
      setDescription("No description yet, please improve");
    });
  }, [item]);

  return (
    <div>
      <p>
        <strong>Description:</strong> {description}
      </p>
      <p>
        <span>Go to this topic ({item.qid}):</span>{" "}
        <a href={item.qidUrl}>Wikidata</a> | {" "}
        <a href={`https://scholia.toolforge.org/topic/${item.qid}`}>Scholia</a> | {" "}
        <a href={`https://synia.toolforge.org/#topic/${item.qid}`}>Synia Topic</a>
      </p>
    </div>
  );
};

export default ItemDetails;

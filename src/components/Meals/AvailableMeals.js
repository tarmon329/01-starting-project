import { useEffect, useState, useCallback } from "react";

import Card from "../UI/Card";
import MealItem from "./MealItem/MealItem";
import classes from "./AvailableMeals.module.css";

const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState();

  const fetchMeals = useCallback(async (err = false) => {
    setIsLoading(true);
    const url = err
      ? "https://react-http-d1a08-default-rtdb.europe-west1.firebasedatabase.app/meals"
      : "https://react-http-d1a08-default-rtdb.europe-west1.firebasedatabase.app/meals.json";
    const fetchObj = err ? { mode: "no-cors" } : {};

    const response = await fetch(url, fetchObj);

    if (!response.ok) {
      throw new Error(`Something went wrong!
      Please Try again.`);
    }

    const responseData = await response.json();

    const loadedMeals = [];

    for (const key in responseData) {
      loadedMeals.push({ id: key, ...responseData[key] });
    }
    setMeals(loadedMeals);
    setIsLoading(false);
    setHttpError(false);
  }, []);

  useEffect(() => {
    fetchMeals().catch((error) => {
      setIsLoading(false);
      console.error(error, error.message);
      setHttpError(error.message);
    });
  }, [fetchMeals]);

  const clickHandler = useCallback(() => {
    fetchMeals().catch((error) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, [fetchMeals]);

  if (isLoading) {
    return (
      <section className={classes.mealsIsLoading}>
        <p>Loading...</p>
      </section>
    );
  }

  if (httpError) {
    return (
      <section className={classes.mealsError}>
        <p>{httpError}</p>
        <button onClick={clickHandler}>Try again</button>
      </section>
    );
  }

  const mealsList = meals.map((meal) => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  return (
    <section className={classes.meals}>
      <Card>
        <ul>{mealsList}</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;

import React from 'react'
import { SortPopup, PizzaBlock, PizzaLoadingBlock } from '../components';
import { useSelector, useDispatch } from 'react-redux';
import { setCategory, setSortBy } from '../redux/actions/filters';
import { fetchPizzas } from '../redux/actions/pizzas';
import Burger from '../components/Burger';


const categoryNames = ['Star Wars', 'Batman', 'City', 'Harry Potter', 'Space'];
const sortItems = [
  { name: 'популярности', type: 'popular', order: 'desc'}, 
  { name: 'цене', type: 'price', order: 'desc'}, 
  { name: 'алфавиту', type: 'name', order: 'asc'},
];


function Home() {
  const dispatch = useDispatch();
  const items = useSelector(({ pizzas }) => pizzas.items);
  const cartItems = useSelector(({ cart }) => cart.items);
  const isLoaded = useSelector(({ pizzas }) => pizzas.isLoaded);
  const { category, sortBy} = useSelector(({ filters }) => filters);


  React.useEffect(() => {
    dispatch(fetchPizzas(sortBy, category));
  }, [category, sortBy]);

  const onSelectCategory = React.useCallback((index) => {
    dispatch(setCategory(index));
  }, []);

  const onSelectSortType = React.useCallback((type) => {
    dispatch(setSortBy(type));
  }, [dispatch]);

  const handleAddPizzaToCart = (obj) => {
    dispatch({
      type: 'ADD_PIZZA_CART',
      payload: obj
    });
  }

  return (
    <div className="container">
      <div className="content__top">
        <Burger
          activeCategory={category}
          onClickCategory={onSelectCategory}
          items={categoryNames} />
        <SortPopup activeSortType={sortBy.type} items={sortItems} onClickSortType={onSelectSortType} />
      </div>
      <h2 className="content__title">Все товары</h2>
      <div className="content__items">
        {
          isLoaded 
          ? items.map((obj) =><PizzaBlock
           onClickAddPizza={handleAddPizzaToCart} 
           key={obj.id} 
           addedCount={cartItems[obj.id] && cartItems[obj.id].items.length}
           {...obj} />)
          : Array(13).fill(0).map((_, index) => <PizzaLoadingBlock key={index} />)}
          
        </div>
    </div>
  )
}

export default Home
"use client";

import { Dispatch, SetStateAction, useState } from "react";

const TrackerHomeInfo = ({ current }: { current: Date }) => {
  const income = getIncome();
  const expense = getExpense();

  return (
    <div className="flex gap-3 px-6">
      <span className="flex gap-1">
        <span className="text-bold text-emerald-900">수입</span>
        <span>{income}원</span>
      </span>
      <span className="flex gap-1">
        <span className="text-bold text-red-800">지출</span>
        <span>{expense}원</span>
      </span>
      <span className="flex gap-1">
        <span className="text-bold text-blue-800">전체</span>
        <span>{income - expense}원</span>
      </span>
    </div>
  );
};

const TrackerHomeMonth = ({
  current,
  setCurrent,
}: {
  current: Date;
  setCurrent: Dispatch<SetStateAction<Date>>;
}) => {
  const [year, month] = getYearMonth(current);
  const [prevYear, prevMonth] = getYearMonth(
    new Date(current.getFullYear(), current.getMonth() - 1)
  );
  const [nextYear, nextMonth] = getYearMonth(
    new Date(current.getFullYear(), current.getMonth() + 1)
  );
  return (
    <div className="flex gap-1 px-6 items-baseline">
      <h2 className="text-lg">{prevMonth}월</h2>
      <h2 className="text-[24px] bold">{month}월</h2>
      <h2 className="text-lg">{nextMonth}월</h2>
    </div>
  );
};

enum CATEGORY_TYPE {
  FOOD = "식비",
  TRANSPORTATION = "교통비",
  CULTURE = "문화생활",
  SHOPPING = "쇼핑",
  ETC = "기타",
}

type ExpenseItemType = {
  id: string;
  date: Date;
  title: string;
  category: CATEGORY_TYPE;
  amount: number;
  income: boolean;
};

function getItems() {
  return [
    {
      id: "1",
      date: new Date(),
      title: "커피",
      category: CATEGORY_TYPE.FOOD,
      amount: 3000,
      income: false,
    },
    {
      id: "2",
      date: new Date(),
      title: "점심",
      category: CATEGORY_TYPE.FOOD,
      amount: 7000,
      income: false,
    },
    {
      id: "3",
      date: new Date(),
      title: "택시",
      category: CATEGORY_TYPE.TRANSPORTATION,
      amount: 5000,
      income: false,
    },
    {
      id: "4",
      date: new Date(),
      title: "책",
      category: CATEGORY_TYPE.CULTURE,
      amount: 15000,
      income: false,
    },
    {
      id: "5",
      date: new Date(),
      title: "월급",
      category: CATEGORY_TYPE.SHOPPING,
      amount: 700000,
      income: true,
    },
  ];
}

const ExpenseItem = (props: ExpenseItemType) => {
  const prettyDate = props.date.toISOString().split("T")[0];
  return (
    <div className="flex gap-4 p-2 items-center hover:bg-gray-200 transition-colors text-sm">
      <span className="font-semibold col-span-1 w-[120px]">{prettyDate}</span>
      <span className="text-blue-600 overflow-hidden overflow-ellipsis whitespace-nowrap col-span-2 w-[240px]">
        {props.title}
      </span>
      <span
        className={
          `font-semibold col-span-1 w-[120px]` +
          (props.income ? " text-green-600" : " text-red-600")
        }
      >
        {props.amount}원
      </span>
      <span className="capitalize col-span-1 w-[120px]">{props.category}</span>
    </div>
  );
};

const TrackerItems = () => {
  const items = getItems();
  return (
    <div className="flex flex-col gap-y-2 p-4 bg-white rounded-xl shadow-lg">
      {items.map((item) => (
        <ExpenseItem key={item.id} {...item} />
      ))}
      <TrackerItemInput />
    </div>
  );
};

const TrackerItemInput = () => {
  const [date, setDate] = useState<Date>(new Date());
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    const date = new Date(dateValue);
    setDate(date); // Set date in state
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  };

  return (
    <form className="flex gap-4 p-2 items-center hover:bg-gray-200 transition-colors text-sm">
      <span className="font-semibold col-span-1 w-[120px] relative">
        {formatDate(date)}
        <input
          type="date"
          onChange={handleDateChange}
          className="absolute w-full left-0 cursor-pointer z-10 h-full top-0"
        />
      </span>
      <input
        type="text"
        className="text-blue-600 overflow-hidden overflow-ellipsis whitespace-nowrap col-span-2 w-[240px] border"
      />
      <input
        type="number"
        className="font-semibold col-span-1 w-[120px] border"
      />
      <select className="capitalize col-span-1 w-[120px]">
        <option value="식비">식비</option>
        <option value="교통비">교통비</option>
        <option value="문화생활">문화생활</option>
        <option value="쇼핑">쇼핑</option>
        <option value="기타">기타</option>
      </select>
    </form>
  );
};

function getYearMonth(current: Date) {
  return [current.getFullYear(), current.getMonth() + 1];
}

function getIncome() {
  return 1000000;
}

function getExpense() {
  return 500000;
}

export default function Home() {
  const [current, setCurrent] = useState<Date>(new Date());

  return (
    <main className="flex flex-col gap-y-2">
      <TrackerHomeMonth current={current} setCurrent={setCurrent} />
      <TrackerHomeInfo current={current} />
      <TrackerItems />
    </main>
  );
}

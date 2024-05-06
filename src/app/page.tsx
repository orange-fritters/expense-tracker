"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

const TrackerHomeInfo = ({ current }: { current: Date }) => {
  const [year, month] = getYearMonth(current);

  const [income, setIncome] = useState<number>(0);
  const [expense, setExpense] = useState<number>(0);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `/api/expenses/infos?year=${year}&month=${month}`
        );
        const data = await response.json();
        setIncome(data.income);
        setExpense(data.expenses);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    })();
  }, []);

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
      <button
        onClick={() =>
          setCurrent(new Date(current.getFullYear(), current.getMonth() - 1))
        }
      >
        <h2 className="text-lg">{prevMonth}월</h2>
      </button>
      <h2 className="text-[24px] bold">{month}월</h2>
      <button
        onClick={() =>
          setCurrent(new Date(current.getFullYear(), current.getMonth() + 1))
        }
      >
        <h2 className="text-lg">{nextMonth}월</h2>
      </button>
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

function prettifyDate(date: Date | string) {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return date.toISOString().split("T")[0].replace(/-/g, ". ");
}

const ExpenseItem = (props: ExpenseItemType) => {
  const handleDelete = async () => {
    try {
      await fetch("/api/expenses", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: props.id,
        }),
      });
      window.location.reload();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  return (
    <div
      className={`flex gap-4 p-2 items-center hover:bg-gray-200 transition-colors text-sm ${
        props.income ? "bg-blue-200" : "bg-red-200"
      }`}
    >
      <span className="font-semibold col-span-1 w-[120px]">
        {prettifyDate(props.date)}
      </span>
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
      <button
        type="submit"
        onClick={handleDelete}
        className="py-1 px-4 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  );
};

const TrackerItems = ({ current }: { current: Date }) => {
  const [items, setItems] = useState<ExpenseItemType[]>([]);
  const [year, month] = getYearMonth(current);
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `/api/expenses?year=${year}&month=${month}`,
          {
            next: { tags: ["expenses"] },
          }
        );
        setItems(await response.json());
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    })();
  }, [year, month]);

  return (
    <div
      className="flex flex-col gap-y-2 p-4 bg-white rounded-xl shadow-lg overflow-scroll max-h-[400px] flex-col-reverse"
      key={`${year}-${month}`}
    >
      <TrackerItemInput />
      {items.map((item) => (
        <ExpenseItem key={item.id} {...item} />
      ))}
    </div>
  );
};

const TrackerItemInput = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<string>("0");
  const [category, setCategory] = useState<string>("식비"); // default category
  const [income, setIncome] = useState<boolean>(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(new Date(e.target.value)); // Set date in state
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value[0] === "+") {
      setIncome(true);
    }
    setAmount(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: date,
          title: title,
          category: category,
          amount: Number(amount),
          income: income,
        }),
      });
      window.location.reload();
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-4 p-2 items-center hover:bg-gray-200 transition-colors text-sm"
    >
      <span className="font-semibold col-span-1 w-[120px] relative h-5">
        <input
          type="date"
          defaultValue={date.toISOString().split("T")[0]}
          onChange={handleDateChange}
          className="absolute w-full left-0 cursor-pointer z-10 h-full top-0"
        />
      </span>
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        className="text-blue-600 overflow-hidden overflow-ellipsis whitespace-nowrap col-span-2 w-[240px] border"
      />
      <input
        type="text"
        placeholder="지출/수입"
        onChange={handleAmountChange}
        className="font-semibold col-span-1 w-[120px] border"
      />
      <select
        value={category}
        onChange={handleCategoryChange}
        className="capitalize col-span-1 w-[120px]"
      >
        <option value="식비">식비</option>
        <option value="교통비">교통비</option>
        <option value="문화생활">문화생활</option>
        <option value="쇼핑">쇼핑</option>
        <option value="기타">기타</option>
      </select>
      <button
        type="submit"
        className="py-1 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
};

function getYearMonth(current: Date) {
  return [current.getFullYear(), current.getMonth() + 1];
}

export default function Home() {
  const [current, setCurrent] = useState<Date>(new Date());

  return (
    <main className="flex flex-col gap-y-2">
      <TrackerHomeMonth current={current} setCurrent={setCurrent} />
      <TrackerHomeInfo current={current} />
      <TrackerItems current={current} />
    </main>
  );
}

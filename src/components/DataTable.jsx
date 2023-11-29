import React, { useEffect, useMemo, useState } from 'react';
import { useTable, usePagination, useRowSelect } from 'react-table';
import axios from 'axios';
import styled from 'styled-components';

const Table = styled.table`
  box-sizing: border-box;
  width: 99%;
  margin: 10px auto;
  overflow: auto;
  text-align: center;
  border: 1px solid #ced4da;
  border-collapse: collapse;
  thead {
    background-color: #cecece;
    th {
      padding: 7px;
      font-size: 14px;
      border: 1px solid #dfe5ec;
    }
  }
  tbody {
    td {
      font-size: 14px;
      border: 1px solid #dfe5ec;
      padding: 4px;
      color: #6d7176;
    }
  }
`;

const CopyButton = styled.button`
  background-color: transparent;
  border: none;
  text-decoration: underline;
  color: #6d7176;
`;

const Pagination = styled.div`
  padding: 30px;
  text-align: center;
  margin: 0 auto;
  .buttonList {
    display: inline-block;
    margin-right: 5px;
  }
  .text {
    display: inline-block;
    color: #b4bac0;
    font-weight: 700;
  }
`;

const Button = styled.button`
  display: inline-block;
  width: 30px;
  height: 30px;
  background-color: transparent;
  border: 1px solid #dfe5ec;
  &.number {
    background-color: #2c3e76;
    color: white;
    border: none;
    border-top: 1px solid #dfe5ec;
    border-bottom: 1px solid #dfe5ec;
  }
`;

const DataTable = ({ pageSize: externalPageSize }) => {
  const [tableData, setTableData] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/orders');
        setTableData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setPageSize(externalPageSize);
  }, [externalPageSize]);

  const columns = useMemo(
    () => [
      {
        accessor: 'name',
        Header: '이름',
      },
      {
        accessor: 'phoneNumber',
        Header: '휴대폰번호',
      },
      {
        accessor: 'dateRange',
        Header: '날짜',
        Cell: ({ row }) => {
          const toDate = row.original.toDate;
          const fromDate = row.original.fromDate;
          const combinedDate = `${fromDate} ~ ${toDate}`;
          return <div>{combinedDate}</div>;
        },
      },
      {
        accessor: 'item',
        Header: '품목',
      },
      {
        accessor: 'supply',
        Header: '물량',
      },
      {
        accessor: 'address',
        Header: '출근지',
      },
      {
        accessor: 'copy',
        Header: '오더복사',
        Cell: ({ row }) => (
          <CopyButton onClick={() => handleCopyOrder(row.original)}>
            오더 복사
          </CopyButton>
        ),
      },
    ],
    []
  );

  const handleCopyOrder = (rowData) => {
    // 여기에 각 데이터를 가지고 오더 복사에 대한 로직을 구현합니다.
    console.log('Copy order for:', rowData);
    // 추가로 필요한 로직을 여기에 작성하세요.
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    setPageSize,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: useMemo(() => tableData, [tableData]),
      initialState: { pageIndex: 0, pageSize: externalPageSize },
      selectedRowIds,
    },
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <input
                type="checkbox"
                {...getToggleAllRowsSelectedProps()}
                indeterminate={undefined}
              />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <input
                type="checkbox"
                {...row.getToggleRowSelectedProps()}
                indeterminate={undefined}
              />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  const handlePageChange = (newPageIndex) => {
    setSelectedRowIds(null);
    if (newPageIndex > pageIndex) {
      nextPage();
    } else if (newPageIndex < pageIndex) {
      previousPage();
    }
  };

  return (
    <>
      <Table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Pagination>
        <div className="buttonList">
          <Button
            onClick={() => handlePageChange(pageIndex - 1)}
            disabled={!canPreviousPage}
          >
            &lt;
          </Button>
          <Button className="number">{pageIndex + 1}</Button>
          <Button
            onClick={() => handlePageChange(pageIndex + 1)}
            disabled={!canNextPage}
          >
            &gt;
          </Button>
        </div>
        <div className="text">
          Page {pageIndex + 1} of {pageOptions.length}
        </div>
      </Pagination>
    </>
  );
};

export default DataTable;

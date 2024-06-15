import React from "react";
import { Layout, Row, Col, Button, Spin } from "antd";
import { useEffect, useState } from "react";

import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { Aptos } from "@aptos-labs/ts-sdk";
import { useWallet, InputTransactionData } from "@aptos-labs/wallet-adapter-react";

const aptos = new Aptos();

type Task = {
  address: string;
  completed: boolean;
  content: string;
  task_id: string;
};


function App() {
  const { account, signAndSubmitTransaction } = useWallet();
  const moduleAddress =
  '0xb50f46b6344af99dd208f35e780b7803ccbfb4a626389e139f2215afb70a1e56';

  const [accountHasList, setAccountHasList] = useState<boolean>(false);
  const [transactionInProgress, setTransactionInProgress] =
  useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  

  const fetchList = async () => {
    if (!account) return [];
    try {
      const todoListResource = await aptos.getAccountResource({
        accountAddress: account?.address,
        resourceType: `${moduleAddress}::todolist::TodoList`,
      });
      console.log(todoListResource, "todoListResource is now true");
      setAccountHasList(true);
    } catch (e: any) {
      console.log(e, "todoListResource is now false");
      setAccountHasList(false);
    }
  };

  const addNewList = async () => {
    if (!account) return [];
    setTransactionInProgress(true);
    const transaction:InputTransactionData = {
        data: {
          function:`${moduleAddress}::todolist::create_list`,
          functionArguments:[]
        }
      }
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(transaction);
      // wait for transaction
      await aptos.waitForTransaction({transactionHash:response.hash});
      setAccountHasList(true);
    } catch (error: any) {
      setAccountHasList(false);
    } finally {
      setTransactionInProgress(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [account?.address]);

  return (
    <>
      <Layout>
        <Row align="middle">
          <Col span={10} offset={2}>
            <h1>Our todolist</h1>
          </Col>
          <Col span={12} style={{ textAlign: "right", paddingRight: "200px" }}>
            <WalletSelector />
          </Col>
        </Row>
      </Layout>
      <Spin spinning={transactionInProgress}>
      {!accountHasList && (
        <Row gutter={[0, 32]} style={{ marginTop: "2rem" }}>
          <Col span={8} offset={8}>
            <Button
              onClick={addNewList}
              block
              type="primary"
              style={{ height: "40px", backgroundColor: "#3f67ff" }}
            >
              Add new list
            </Button>
          </Col>
        </Row>
      )}
    </Spin>
    </>
  );
}

export default App;

import {BackTop, Button, DatePicker, Form, Input, Spin, message} from "antd"
import {
  MinusCircleTwoTone,
  PlusCircleTwoTone,
  UpCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons"
import React, {useCallback, useEffect, useState} from "react"
import ReactDOM from "react-dom"
import YAML from "yamljs"
import moment from "moment"

import googleAppsScript from "../../google-apps-script"

const Metadata = () => {
  const [metadata, setMetadata] = useState({})
  const [loading, setLoading] = useState(true)
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    googleAppsScript
      .getDriveDescription()
      .then(async (description) => {
        let descriptionObject = {}

        try {
          descriptionObject = YAML.parse(description)

          if (typeof descriptionObject !== "object") {
            throw new Error("Description is not YAML")
          }
        } catch (e) {
          descriptionObject.description = description
        }

        if (!descriptionObject.date) {
          const createdDateString = await googleAppsScript.getDriveCreatedDate()
          descriptionObject.date = createdDateString
        }

        setMetadata(descriptionObject)
        setLoading(false)
      })
      .catch(() => message.error("Error"))
  }, [])

  const handleSuccess = useCallback((values) => {
    const newMetadata = values.metadata.reduce(
      (acc, {label, value}) => ({
        ...acc,
        [label]: label === "date" ? value.toISOString() : value,
      }),
      {}
    )
    googleAppsScript
      .setDriveDescription(YAML.stringify(newMetadata))
      .then(() => {
        setSubmitting(false)
        message.success("Metadata saved")
      })
      .catch(() => message.error("Error"))
  }, [])

  const handleError = useCallback(() => {
    setSubmitting(false)
    message.error("Error")
  }, [])

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "50px",
        height: "400px",
      }}
    >
      {loading ? (
        <Spin size="large" style={{alignSelf: "center"}} />
      ) : (
        <Form
          form={form}
          autoComplete="off"
          onFinish={handleSuccess}
          onFinishFailed={handleError}
          validateMessages={{
            required: "Required",
          }}
          initialValues={{
            metadata: Object.entries(metadata)
              .reduce(
                (acc, [label, value]) => [
                  ...acc,
                  {
                    label,
                    value: label === "date" ? moment(new Date(value)) : value,
                  },
                ],
                []
              )
              .sort((a) => (a.label === "date" ? -1 : 1)),
          }}
          style={{
            maxWidth: "450px",
            width: "100%",
          }}
        >
          <Form.List name="metadata">
            {(fields, {add, remove}) => {
              return (
                <>
                  <div
                    style={{
                      display: "flex",
                      marginRight: "28px",
                      fontWeight: "bold",
                      textAlign: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <div style={{flex: "1"}}>Label</div>
                    <div style={{flex: "1"}}>Value</div>
                  </div>
                  {fields.map(({key, ...field}) => {
                    const isDate =
                      form.getFieldValue("metadata")[field.name].label ===
                      "date"
                    return (
                      <div
                        key={key}
                        style={{
                          display: "flex",
                          marginBottom: "8px",
                        }}
                      >
                        <Form.Item style={{marginBottom: "0", flex: "1"}}>
                          <Input.Group compact style={{display: "flex"}}>
                            <Form.Item
                              {...field}
                              name={[field.name, "label"]}
                              fieldKey={[field.fieldKey, "label"]}
                              rules={[{required: true}]}
                              noStyle
                            >
                              <Input style={{flex: "1"}} disabled={isDate} />
                            </Form.Item>
                            <Form.Item
                              {...field}
                              name={[field.name, "value"]}
                              fieldKey={[field.fieldKey, "value"]}
                              rules={[{required: true}]}
                              noStyle
                            >
                              {isDate ? (
                                <DatePicker
                                  inputReadOnly
                                  showTime={{format: "HH:mm"}}
                                  allowClear={false}
                                  style={{width: "200px"}}
                                />
                              ) : (
                                <Input style={{width: "200px"}} />
                              )}
                            </Form.Item>
                          </Input.Group>
                        </Form.Item>
                        <div
                          style={{
                            width: "20px",
                            marginLeft: "8px",
                            marginTop: "5px",
                          }}
                        >
                          {!isDate && (
                            <MinusCircleTwoTone
                              onClick={() => remove(field.name)}
                              style={{marginLeft: "8px"}}
                            />
                          )}
                        </div>
                      </div>
                    )
                  })}
                  <Form.Item style={{marginRight: "28px"}}>
                    <Button
                      type="dashed"
                      onClick={() => {
                        add({label: "", value: ""})
                      }}
                      block
                    >
                      <PlusCircleTwoTone /> Add element
                    </Button>
                  </Form.Item>
                </>
              )
            }}
          </Form.List>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              position: "fixed",
              bottom: "0px",
              right: "0px",
              left: "0px",
              background: "#fff",
              paddingTop: "16px",
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => setSubmitting(true)}
              loading={submitting}
            >
              <SaveOutlined />
              Save Metadata
            </Button>
          </div>
          <BackTop visibilityHeight={40}>
            <div
              style={{
                position: "fixed",
                bottom: "0px",
                left: "0px",
              }}
            >
              <Button>
                <UpCircleOutlined />
                Back to top
              </Button>
            </div>
          </BackTop>
        </Form>
      )}
    </div>
  )
}

ReactDOM.render(<Metadata />, document.getElementById("index"))

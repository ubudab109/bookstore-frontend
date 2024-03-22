import { Badge, Button, Card, Stack } from "react-bootstrap";
import { Cart } from "react-bootstrap-icons";

interface BookProps {
    id: number;
    title: string;
    writer: string;
    cover_image: string;
    price: number;
    tags: Array<string>;
    isLoggedIn: boolean;
    action: () => Promise<void>;
}

const BookCard: React.FC<BookProps> = ({
    id,
    title,
    writer,
    cover_image,
    price,
    tags,
    isLoggedIn,
    action,
}) => (
    <Card className="custom-card">
        <Card.Img
            variant="top"
            alt="book-img"
            src={cover_image}
            style={{ width: '50%', margin: '0 auto' }}
        />
        <Card.Body className="text-center">
            <Card.Title>{title} {id}</Card.Title>
            <Card.Text>
                Writer: {writer}
            </Card.Text>
            <Card.Text>
                Price: {price}pts
            </Card.Text>
            <Stack direction="horizontal" gap={1}>
                {
                    tags.map((tag, ind) => (
                        <Badge key={ind} bg="primary">{tag}</Badge>
                    ))
                }
            </Stack>
        </Card.Body>
        {
            !isLoggedIn ? null :
                <Card.Footer>
                    <Cart fontVariant={"primary"} style={{cursor: 'pointer'}} onClick={action} />
                </Card.Footer>
        }
    </Card>
);

export default BookCard;
